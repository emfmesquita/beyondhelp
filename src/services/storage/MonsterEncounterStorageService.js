import ConfigStorageService from "./ConfigStorageService";
import Configuration from '../../data/Configuration';
import MonsterData from '../../data/MonsterData';
import MonsterEncounterData from '../../data/MonsterEncounterData';
import MonsterListData from '../../data/MonsterListData';
import Q from "./Q";
import StorageService from "./StorageService";
import MonsterListStorageService from "./MonsterListStorageService";
import MonsterStorageService from "./MonsterStorageService";

class MonsterEncounterStorageService {
    /**
     * Gets all the encounters trees of data.
     */
    static getMonsterEncounters(): Promise<{ active: MonsterEncounterData, all: MonsterEncounterData[] }> {
        let storageData, result, listMap: Map<string, MonsterListData[]>, encounters: MonsterEncounterData[];

        return StorageService.getStorageData().then(foundData => {
            storageData = foundData;
            return ConfigStorageService.getConfig();
        }).then(config => {
            // if there is no encounter creates it, updates the config and returns because there is no more data to be gathered
            if (!config.activeEncounterId) {
                return this.createEncounter("My New Encounter", config).then((encounter) => {
                    result = { active: encounter, all: [encounter] };
                    return null;
                });
            }

            // mounts the tree of data of each encounter
            encounters = StorageService.find(storageData, Q.clazz("MonsterEncounterData"))
                .sort((a: MonsterEncounterData, b: MonsterEncounterData) => a.name.localeCompare(b.name));
            const activeEncounter = encounters.find(encounter => encounter.storageId === config.activeEncounterId);
            result = { active: activeEncounter, all: encounters };

            return MonsterListStorageService.findListGroupedByEncounter(storageData).then((map) => {
                listMap = map;
                return listMap.length === 0 ? null : MonsterStorageService.findMonstersGroupedByList(storageData);
            });
        }).then(monsterMap => {
            if (!monsterMap) return result;

            listMap.forEach(lists => lists.forEach(list => {
                list.monsters = monsterMap.get(list.storageId);
                if (list.monsters) list.monsters = list.monsters.sort((a: MonsterData, b: MonsterData) => a.order - b.order);
            }));
            encounters.forEach(encounter => {
                encounter.lists = listMap.get(encounter.storageId);
                if (encounter.lists) encounter.lists = encounter.lists.sort((a: MonsterListData, b: MonsterListData) => a.order - b.order);
            });

            return result;
        });
    }

    static getEncounterLists(encounterId: string, storageData): MonsterListData[] {
        return StorageService.find(storageData, Q.clazz("MonsterListData"), Q.eq("encounterId", encounterId));
    }

    static createEncounter(name: string, optionalConfig: Configuration): Promise<MonsterEncounterData> {
        let config;
        const configPromise = optionalConfig ? Promise.resolve(optionalConfig) : ConfigStorageService.getConfig();
        return configPromise.then(result => {
            config = result;
            return StorageService.createData("MonsterEncounterData", new MonsterEncounterData(null, name));
        }).then(newEncounter => {
            config.activeEncounterId = newEncounter.storageId;
            return StorageService.updateData(config).then(() => newEncounter);
        });
    }

    /**
     * Deletes an encounter all it's lists and monsters. And updates the config with the new active encounter.
     */
    static deleteEncounter(oldEncounter: MonsterEncounterData, newActiveEncounter: MonsterEncounterData): Promise {
        const toDelete = [];
        return ConfigStorageService.getConfig().then(config => {
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