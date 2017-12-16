import ConfigStorageService from "./ConfigStorageService";
import MonsterData from '../../data/MonsterData';
import MonsterEncounterData from '../../data/MonsterEncounterData';
import MonsterEncounterStorageService from "./MonsterEncounterStorageService";
import MonsterListData from '../../data/MonsterListData';
import MonsterListStorageService from "./MonsterListStorageService";
import Q from "./Q";
import StorageService from "./StorageService";

class MonsterStorageService {

    static findMonstersGroupedByList(storageData): Promise<Map<string, MonsterData[]>> {
        const monsterMap = StorageService.findGroupedBy(storageData, "listId", Q.clazz("MonsterData"));

        // check existing ordering info
        const firstMonster: MonsterData = StorageService.findSingle(storageData, Q.clazz("MonsterData"));
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
            checkOrderPromise = StorageService.updateData(toSaveMonsters);
        }

        return checkOrderPromise.then(() => monsterMap);
    }

    /**
     * Creates a monster and all the parent date related to it.
     */
    static createMonster(monsterId: string, name: string, hp: string): Promise<MonsterData> {
        let storageData, config, encounter, list;
        return StorageService.getStorageData().then(result => {
            storageData = result;
            return ConfigStorageService.getConfig();
        }).then(result => {
            config = result;

            // if there is no encounter creates the default one and updates the config with it
            if (config.activeEncounterId) {
                const activeEncounter = StorageService.findSingle(storageData, Q.clazz("MonsterEncounterData"), Q.eq("storageId", config.activeEncounterId));
                return Promise.resolve(activeEncounter);
            }
            return MonsterEncounterStorageService.createEncounter("My New Encounter", config);
        }).then(result => {
            encounter = result;
            // if there is not list for the monster type creates it
            list = StorageService.findSingle(storageData, Q.clazz("MonsterListData"), Q.eq("encounterId", encounter.storageId), Q.eq("monsterId", monsterId));
            return list ? Promise.resolve(list) : MonsterListStorageService.createList(name, monsterId, encounter.storageId, storageData);
        }).then(result => {
            list = result;
            // creates the monster
            const newMonster = new MonsterData(null, list.storageId, hp, list.lastNumber + 1);
            return StorageService.createData("MonsterData", newMonster);
        }).then((monster) => {
            // updates list last monster number and possible name change
            list.lastNumber = list.lastNumber + 1;
            list.name = name;
            return StorageService.updateData(list).then(() => monster);
        });
    }

    /**
     * Counts "alive / total" monster of active encounter.
     */
    static countActiveMonsters(): Promise<{ alive: number, total: number }> {
        let storageData;
        const empty = { total: 0, alive: 0 };
        return StorageService.getStorageData().then(result => {
            storageData = result;
            return ConfigStorageService.getConfig();
        }).then(config => {
            if (!config.activeEncounterId) {
                return empty;
            }

            const activeEncounter = StorageService.findSingle(storageData, Q.clazz("MonsterEncounterData"), Q.eq("storageId", config.activeEncounterId));

            const lists = StorageService.find(storageData, Q.clazz("MonsterListData"), Q.eq("encounterId", activeEncounter.storageId));
            if (lists.length === 0) {
                return empty;
            }

            const metaIds = lists.map(list => list.storageId);
            const monsters: MonsterData[] = StorageService.find(storageData, Q.clazz("MonsterData"), Q.in("listId", metaIds));
            const total = monsters.length;
            const alive = monsters.filter(m => m.currentHp > 0).length;
            return { total, alive };
        });
    }

    /**
     * Deletes a monster and it's list if it is the last one.
     */
    static deleteMonster(monster: MonsterData): Promise {
        return StorageService.deleteData(monster).then(() => StorageService.getStorageData()).then(storageData => {
            const monsterOfSameList = StorageService.find(storageData, Q.clazz("MonsterData"), Q.eq("listId", monster.listId));
            if (monsterOfSameList.length > 0) return Promise.resolve();

            const list = MonsterListStorageService.findList(monster.listId, storageData);
            return MonsterListStorageService.deleteList(list);
        });
    }
}

export default MonsterStorageService;