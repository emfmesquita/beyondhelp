import MonsterData from '../../data/MonsterData';
import MonsterEncounterData from '../../data/MonsterEncounterData';
import MonsterListData from '../../data/MonsterListData';
import Q from "./Q";
import StorageService from "./StorageService"

class MonsterStorageService {
    /**
     * Creates a monster and all the parent date related to it.
     */
    static createMonster(monsterId: string, name: string, hp: string): Promise<MonsterData> {
        let storageData, config, encounter, list;
        return StorageService.getStorageData().then(result => {
            storageData = result;
            return StorageService.getConfig();
        }).then(result => {
            config = result;

            // if there is no encounter creates the default one and updates the config with it
            if (config.activeEncounterId) {
                const activeEncounter = StorageService.findSingle(storageData, Q.clazz("MonsterEncounterData"), Q.eq("storageId", config.activeEncounterId));
                return Promise.resolve(activeEncounter);
            }
            return StorageService.createData("MonsterEncounterData", new MonsterEncounterData(null, "My New Encounter")).then(encounter => {
                config.activeEncounterId = encounter.storageId;
                return StorageService.updateData(config).then(() => encounter);
            });
        }).then(result => {
            encounter = result;
            // if there is not list for the monster type creates it
            list = StorageService.findSingle(storageData, Q.clazz("MonsterListData"), Q.eq("encounterId", encounter.storageId), Q.eq("monsterId", monsterId));
            return list ? Promise.resolve(list) : StorageService.createData("MonsterListData", new MonsterListData(null, encounter.storageId, monsterId, name, 0));
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
            return StorageService.getConfig();
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

            const list = StorageService.findSingle(storageData, Q.clazz("MonsterListData"), Q.eq("storageId", monster.listId));
            if (!list) return Promise.resolve();

            return StorageService.deleteData(list);
        });
    }
}

export default MonsterStorageService;