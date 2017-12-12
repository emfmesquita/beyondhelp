import MonsterData from '../../data/MonsterData';
import MonsterEncounterData from '../../data/MonsterEncounterData';
import MonsterListData from '../../data/MonsterListData';
import Q from "./Q";
import StorageService from "./StorageService";

class MonsterEncounterStorageService {
    /**
     * Gets all the encounters trees of data.
     */
    static getMonsterEncounters(): Promise<{ active: MonsterEncounterData, all: MonsterEncounterData[] }> {
        let storageData;

        return StorageService.getStorageData().then(result => {
            storageData = result;
            return StorageService.getConfig();
        }).then(config => {
            // if there is no encounter creates it, updates the config and returns because there is no more data to be gathered
            if (!config.activeEncounterId) {
                return StorageService.createData("MonsterEncounterData", new MonsterEncounterData(null, "My New Encounter")).then(encounter => {
                    config.activeEncounterId = encounter.storageId;
                    return StorageService.updateData(config).then(() => {
                        return { active: encounter, all: [encounter] };
                    });
                });
            }

            // mounts the tree of data of each encounter
            const encounters: MonsterEncounterData[] = StorageService.find(storageData, Q.clazz("MonsterEncounterData"))
                .sort((a: MonsterEncounterData, b: MonsterEncounterData) => a.name.localeCompare(b.name));
            const activeEncounter = encounters.find(encounter => encounter.storageId === config.activeEncounterId);
            const result = { active: activeEncounter, all: encounters };

            const listMap: Map<string, MonsterListData[]> = StorageService.findGroupedBy(storageData, "encounterId", Q.clazz("MonsterListData"));
            if (listMap.length === 0) {
                return result;
            }

            // check existing ordering info
            const firstList: MonsterListData = StorageService.findSingle(storageData, Q.clazz("MonsterListData"));
            let checkOrderPromise = Promise.resolve();
            if (firstList.order === null || firstList.order === undefined) {
                const toSaveLists = [];
                for (var encounterId of listMap.keys()) {
                    let lists = listMap.get(encounterId);
                    if (!lists || lists.length === 0) return;
                    lists = lists.sort((a: MonsterListData, b: MonsterListData) => a.name.localeCompare(b.name));
                    lists.forEach((list, idx) => {
                        list.order = idx;
                        toSaveLists.push(list);
                    });
                }
                checkOrderPromise = StorageService.updateData(toSaveLists);
            }

            return checkOrderPromise.then(() => {
                const monsterMap: Map<string, MonsterData[]> = StorageService.findGroupedBy(storageData, "listId", Q.clazz("MonsterData"));
                listMap.forEach(lists => lists.forEach(list => list.monsters = monsterMap.get(list.storageId)));
                encounters.forEach(encounter => {
                    encounter.lists = listMap.get(encounter.storageId);
                    encounter.lists && encounter.lists.sort((a: MonsterListData, b: MonsterListData) => a.order > b.order);
                });
                return result;
            });
        });
    }

    static createEncounter(name: string): Promise {
        let config;
        return StorageService.getConfig().then(result => {
            config = result;
            return StorageService.createData("MonsterEncounterData", new MonsterEncounterData(null, name));
        }).then(newEncounter => {
            config.activeEncounterId = newEncounter.storageId;
            return StorageService.updateData(config);
        });
    }

    /**
     * Deletes an encounter all it's lists and monsters. And updates the config with the new active encounter.
     */
    static deleteEncounter(oldEncounter: MonsterEncounterData, newActiveEncounter: MonsterEncounterData): Promise {
        const toDelete = [];
        return StorageService.getConfig().then(config => {
            config.activeEncounterId = newActiveEncounter.storageId;
            return StorageService.updateData(config);
        }).then(() => {
            const toDelete = [];
            toDelete.push(oldEncounter);

            if (!oldEncounter.lists) return StorageService.deleteData(toDelete);

            oldEncounter.lists.forEach(list => {
                toDelete.push(list);
                if (list.monsters) list.monsters.forEach(monster => toDelete.push(monster));
            });
            return StorageService.deleteData(toDelete);
        });
    }
}

export default MonsterEncounterStorageService;