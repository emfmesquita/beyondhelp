import ConfigStorageService from "./ConfigStorageService";
import MonsterData from '../../data/MonsterData';
import MonsterEncounterData from '../../data/MonsterEncounterData';
import MonsterEncounterStorageService from "./MonsterEncounterStorageService";
import MonsterListData from '../../data/MonsterListData';
import MonsterListStorageService from "./MonsterListStorageService";
import Q from "./Q";
import type StorageData from "../../data/StorageData";
import SyncStorageService from "./SyncStorageService";

const getCurrentOrderValue = function (listId: string, storageData: StorageData): number {
    const monsters = MonsterListStorageService.getListMonsters(listId, storageData);
    if (!monsters || monsters.length === 0) return 0;
    let maxOrder = 0;
    monsters.forEach(monster => {
        if (maxOrder < monster.order) maxOrder = monster.order;
    });
    return maxOrder + 1;
};

class MonsterStorageService {

    static findMonstersGroupedByList(storageData: StorageData): Promise<Map<string, MonsterData[]>> {
        const monsterMap = SyncStorageService.findGroupedBy(storageData, "listId", Q.clazz("MonsterData"));

        // check existing ordering info
        const firstMonster: MonsterData = SyncStorageService.findSingle(storageData, Q.clazz("MonsterData"));
        let checkOrderPromise = Promise.resolve();
        if (firstMonster && (firstMonster.order === null || firstMonster.order === undefined)) {
            const toSaveMonsters = [];
            for (var listId of monsterMap.keys()) {
                let monsters = monsterMap.get(listId);
                if (!monsters || monsters.length === 0) continue;
                monsters.forEach((monster, idx) => {
                    monster.order = idx;
                    toSaveMonsters.push(monster);
                });
            }
            checkOrderPromise = SyncStorageService.updateData(toSaveMonsters);
        }

        return checkOrderPromise.then(() => monsterMap);
    }

    /**
     * Creates a monster and all the parent date related to it.
     */
    static createMonster(monsterId: string, name: string, hp: string): Promise<MonsterData> {
        let storageData: StorageData, config, encounter, list;
        return SyncStorageService.getStorageData().then(result => {
            storageData = result;
            return ConfigStorageService.getConfig();
        }).then(result => {
            config = result;

            // if there is no encounter creates the default one and updates the config with it
            if (config.activeEncounterId) {
                const activeEncounter = SyncStorageService.findSingle(storageData, Q.clazz("MonsterEncounterData"), Q.eq("storageId", config.activeEncounterId));
                return Promise.resolve(activeEncounter);
            }
            return MonsterEncounterStorageService.createEncounter("My New Encounter", config);
        }).then(result => {
            encounter = result;
            // if there is not list for the monster type creates it
            list = SyncStorageService.findSingle(storageData, Q.clazz("MonsterListData"), Q.eq("encounterId", encounter.storageId), Q.eq("monsterId", monsterId));
            return list ? Promise.resolve(list) : MonsterListStorageService.createList(name, monsterId, encounter.storageId, storageData);
        }).then(result => {
            list = result;
            // creates the monster
            const newMonster = new MonsterData(null, list.storageId, hp, list.lastNumber + 1);
            newMonster.order = getCurrentOrderValue(list.storageId, storageData);
            return SyncStorageService.createData("MonsterData", newMonster);
        }).then((monster) => {
            // updates list last monster number and possible name change
            list.lastNumber = list.lastNumber + 1;
            list.name = name;
            return SyncStorageService.updateData(list).then(() => monster);
        });
    }

    /**
     * Counts "alive / total" monster of active encounter.
     */
    static countActiveMonsters(): Promise<{ alive: number, total: number }> {
        let storageData: StorageData;
        const empty = { total: 0, alive: 0 };
        return SyncStorageService.getStorageData().then(result => {
            storageData = result;
            return ConfigStorageService.getConfig();
        }).then(config => {
            if (!config.activeEncounterId) {
                return empty;
            }

            const activeEncounter = SyncStorageService.findSingle(storageData, Q.clazz("MonsterEncounterData"), Q.eq("storageId", config.activeEncounterId));

            const lists = SyncStorageService.find(storageData, Q.clazz("MonsterListData"), Q.eq("encounterId", activeEncounter.storageId));
            if (lists.length === 0) {
                return empty;
            }

            const metaIds = lists.map(list => list.storageId);
            const monsters: MonsterData[] = SyncStorageService.find(storageData, Q.clazz("MonsterData"), Q.in("listId", metaIds));
            const total = monsters.length;
            const alive = monsters.filter(m => m.currentHp > 0).length;
            return { total, alive };
        });
    }

    /**
     * Deletes a monster and it's list if it is the last one.
     */
    static deleteMonster(monster: MonsterData): Promise {
        return SyncStorageService.deleteData(monster).then(() => SyncStorageService.getStorageData()).then(storageData => {
            const monsterOfSameList = SyncStorageService.find(storageData, Q.clazz("MonsterData"), Q.eq("listId", monster.listId));
            if (monsterOfSameList.length > 0) return Promise.resolve();

            const list = MonsterListStorageService.findList(monster.listId, storageData);
            return MonsterListStorageService.deleteList(list);
        });
    }
}

export default MonsterStorageService;