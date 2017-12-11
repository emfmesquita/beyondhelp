import CharacterFoldersData from '../data/CharacterFoldersData';
import Configuration from '../data/Configuration';
import Data from "../data/Data";
import MonsterData from '../data/MonsterData';
import MonsterEncounterData from '../data/MonsterEncounterData';
import MonsterListData from '../data/MonsterListData';

/* global chrome */

type StorageData = { [key: string]: Data }
const ConfigurationId = "bh-config";

/**
 * Class that handles storage data ids prefixes.
 */
class Prefix {
    static getStoragePrefix(dataClass: string) {
        switch (dataClass) {
            case "MonsterData":
                return "bh-monster-";
            case "MonsterListData":
                return "bh-monsterlist-";
            case "MonsterEncounterData":
                return "bh-monsterencounter-";
            default:
                return undefined;
        }
    }

    static createStorageId(dataClass: string, increment: number) {
        if (dataClass === "Configuration") return ConfigurationId;
        if (!increment) {
            increment = 0;
        }
        return Prefix.getStoragePrefix(dataClass) + (new Date().getTime() + increment);
    }
}

/**
 * Class with querybuilder to use on finds.
 */
class Q {
    static clazz(dataClass: string) {
        return (data: Data) => data.storageId && data.storageId.startsWith(Prefix.getStoragePrefix(dataClass));
    }

    static eq(propName: string, propValue: any) {
        return (data: Data) => data[propName] === propValue;
    }

    static in(propName: string, array: any[]) {
        return (data: Data) => array.indexOf(data[propName]) > -1;
    }
}

/**
 * @param {string} id If null get all entries.
 */
const getStorageData = function (id: string): Promise<StorageData> {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(id ? id : null, (storageData: StorageData) => {
            chrome.runtime.lastError ? reject(chrome.runtime.lastError) : resolve(storageData);
        });
    });
};

const innerFind = function (data: Data, queries): boolean {
    return !queries || queries.every((query) => query(data));
};

const findSingle = function (storageData: StorageData, ...queries): Data {
    const storageId = Object.keys(storageData).find(storageId => innerFind(storageData[storageId], queries));
    return storageId ? storageData[storageId] : undefined;
};

const find = function (storageData: StorageData, ...queries): Data[] {
    const found = [];
    Object.keys(storageData).forEach(storageId => {
        const data = storageData[storageId];
        if (innerFind(data, queries)) {
            found.push(data);
        }
    });
    return found;
};

const findGroupedBy = function (storageData: StorageData, groupProp: string, ...queries): Map<string, Data[]> {
    const result = new Map();
    Object.keys(storageData).forEach((storageId) => {
        const data = storageData[storageId];
        if (!innerFind(data, queries)) return;

        const propValue = data[groupProp];
        if (!result.has(propValue)) {
            result.set(propValue, []);
        }
        result.get(propValue).push(data);
    });
    return result;
};

const deleteData = function (data: Data | Data[]): Promise<Data> {
    return new Promise((resolve, reject) => {
        const toDelete = Array.isArray(data) ? data.map((d) => d.storageId) : data.storageId;
        chrome.storage.sync.remove(toDelete, (error) => {
            chrome.runtime.lastError ? reject(chrome.runtime.lastError) : resolve();
            chrome.runtime.sendMessage({ reload: true });
        });
    });
};

class StorageService {

    /**
     * Gets or creates the configuration data.
     */
    static getConfig(): Promise<Configuration> {
        return this.getData(ConfigurationId).then(config => {
            return config ? Promise.resolve(config) : this.createData("Configuration", new Configuration());
        });
    }

    static createData(dataClass: string, data: Data): Promise {
        return new Promise((resolve, reject) => {
            const storageEntry: StorageData = {};
            if (!data.storageId) {
                data.storageId = Prefix.createStorageId(dataClass);
            }
            storageEntry[data.storageId] = data;
            chrome.storage.sync.set(storageEntry, () => {
                chrome.runtime.lastError ? reject(chrome.runtime.lastError) : resolve(data);
                chrome.runtime.sendMessage({ reload: true });
            });
        });
    }

    static batchCreate(dataClass: string, dataArray: Array<Data>): Promise {
        return new Promise((resolve, reject) => {
            const storageEntry: StorageData = {};
            dataArray.forEach((data, idx) => {
                if (!data.storageId) {
                    data.storageId = Prefix.createStorageId(dataClass, idx);
                }
                storageEntry[data.storageId] = data;
            });
            chrome.storage.sync.set(storageEntry, () => {
                chrome.runtime.lastError ? reject(chrome.runtime.lastError) : resolve(dataArray);
                chrome.runtime.sendMessage({ reload: true });
            });
        });
    }

    static getData(id: string): Promise<Data> {
        return getStorageData(id).then(storageData => storageData[id]);
    }

    static updateData(data: Data): Promise {
        return this.createData(null, data);
    }

    static batchUpdate(dataArray: Array<Data>): Promise {
        return this.batchCreate(null, dataArray);
    }

    /**
     * Creates a monster and all the parent date related to it.
     */
    static createMonster(monsterId: string, name: string, hp: string): Promise<MonsterData> {
        let storageData, config, encounter, list;
        return getStorageData().then(result => {
            storageData = result;
            return this.getConfig();
        }).then(result => {
            config = result;

            // if there is no encounter creates the default one and updates the config with it
            if (config.activeEncounterId) {
                const activeEncounter = findSingle(storageData, Q.clazz("MonsterEncounterData"), Q.eq("storageId", config.activeEncounterId));
                return Promise.resolve(activeEncounter);
            }
            return this.createData("MonsterEncounterData", new MonsterEncounterData(null, "My New Encounter")).then(encounter => {
                config.activeEncounterId = encounter.storageId;
                return this.updateData(config).then(() => encounter);
            });
        }).then(result => {
            encounter = result;
            // if there is not list for the monster type creates it
            list = findSingle(storageData, Q.clazz("MonsterListData"), Q.eq("encounterId", encounter.storageId), Q.eq("monsterId", monsterId));
            return list ? Promise.resolve(list) : this.createData("MonsterListData", new MonsterListData(null, encounter.storageId, monsterId, name, 0));
        }).then(result => {
            list = result;
            // creates the monster
            const newMonster = new MonsterData(null, list.storageId, hp, list.lastNumber + 1);
            return this.createData("MonsterData", newMonster);
        }).then((monster) => {
            // updates list last monster number and possible name change
            list.lastNumber = list.lastNumber + 1;
            list.name = name;
            return this.updateData(list).then(() => monster);
        });
    }

    /**
     * Gets all the encounters trees of data.
     */
    static getMonsterEncounters(): Promise<{ active: MonsterEncounterData, all: MonsterEncounterData[] }> {
        let storageData;

        return getStorageData().then(result => {
            storageData = result;
            return this.getConfig();
        }).then(config => {
            // if there is no encounter creates it, updates the config and returns because there is no more data to be gathered
            if (!config.activeEncounterId) {
                return this.createData("MonsterEncounterData", new MonsterEncounterData(null, "My New Encounter")).then(encounter => {
                    config.activeEncounterId = encounter.storageId;
                    return this.updateData(config).then(() => {
                        return { active: encounter, all: [encounter] };
                    });
                });
            }

            // mounts the tree of data of each encounter
            const encounters: MonsterEncounterData[] = find(storageData, Q.clazz("MonsterEncounterData"))
                .sort((a: MonsterEncounterData, b: MonsterEncounterData) => a.name.localeCompare(b.name));
            const activeEncounter = encounters.find(encounter => encounter.storageId === config.activeEncounterId);
            const result = { active: activeEncounter, all: encounters };

            const listMap: Map<string, MonsterListData[]> = findGroupedBy(storageData, "encounterId", Q.clazz("MonsterListData"));
            if (listMap.length === 0) {
                return result;
            }

            const monsterMap: Map<string, MonsterData[]> = findGroupedBy(storageData, "listId", Q.clazz("MonsterData"));
            listMap.forEach(lists => lists.forEach(list => list.monsters = monsterMap.get(list.storageId)));
            encounters.forEach(encounter => {
                encounter.lists = listMap.get(encounter.storageId);
                encounter.lists && encounter.lists.sort((a: MonsterListData, b: MonsterListData) => a.name.localeCompare(b.name));
            });
            return result;
        });
    }

    /**
     * Deletes a monster and it's list if it is the last one.
     */
    static deleteMonster(monster: MonsterData): Promise {
        return deleteData(monster).then(() => getStorageData()).then(storageData => {
            const monsterOfSameList = find(storageData, Q.clazz("MonsterData"), Q.eq("listId", monster.listId));
            if (monsterOfSameList.length > 0) return Promise.resolve();

            const list = findSingle(storageData, Q.clazz("MonsterListData"), Q.eq("storageId", monster.listId));
            if (!list) return Promise.resolve();

            return deleteData(list);
        });
    }

    /**
     * Counts "alive / total" monster of active encounter.
     */
    static countActiveMonsters(): Promise<{ alive: number, total: number }> {
        let storageData;
        const empty = { total: 0, alive: 0 };
        return getStorageData().then(result => {
            storageData = result;
            return this.getConfig();
        }).then(config => {
            if (!config.activeEncounterId) {
                return empty;
            }

            const activeEncounter = findSingle(storageData, Q.clazz("MonsterEncounterData"), Q.eq("storageId", config.activeEncounterId));

            const lists = find(storageData, Q.clazz("MonsterListData"), Q.eq("encounterId", activeEncounter.storageId));
            if (lists.length === 0) {
                return empty;
            }

            const metaIds = lists.map(list => list.storageId);
            const monsters: MonsterData[] = find(storageData, Q.clazz("MonsterData"), Q.in("listId", metaIds));
            const total = monsters.length;
            const alive = monsters.filter(m => m.currentHp > 0).length;
            return { total, alive };
        });
    }

    static deleteList(list: MonsterListData): Promise {
        const toDelete = [];
        toDelete.push(list);
        list.monsters.forEach(monster => toDelete.push(monster));
        return deleteData(toDelete);
    }

    static createEncounter(name: string): Promise {
        let config;
        return this.getConfig().then(result => {
            config = result;
            return this.createData("MonsterEncounterData", new MonsterEncounterData(null, name));
        }).then(newEncounter => {
            config.activeEncounterId = newEncounter.storageId;
            return this.updateData(config);
        });
    }

    /**
     * Deletes an encounter all it's lists and monsters. And updates the config with the new active encounter.
     */
    static deleteEncounter(oldEncounter: MonsterEncounterData, newActiveEncounter: MonsterEncounterData): Promise {
        const toDelete = [];
        return this.getConfig().then(config => {
            config.activeEncounterId = newActiveEncounter.storageId;
            return this.updateData(config);
        }).then(() => {
            const toDelete = [];
            toDelete.push(oldEncounter);

            if (!oldEncounter.lists) return deleteData(toDelete);

            oldEncounter.lists.forEach(list => {
                toDelete.push(list);
                if (list.monsters) list.monsters.forEach(monster => toDelete.push(monster));
            });
            return deleteData(toDelete);
        });
    }

    /**
     * Saves the structure of folders of my characters page on storage.
     * @param {CharacterFoldersData} folders 
     * @param {string} owner Username of the owner user.
     */
    static saveMyCharactesFolders(folders: CharacterFoldersData, owner: string): Promise<CharacterFoldersData> {
        if (!folders.storageId) {
            folders.storageId = "bh-charfolders-" + owner;
        }
        return this.createData(null, folders);
    }

    /**
     * Gets the structure of folders of my characters page from storage.
     * @param {string} owner Username of the owner user.
     */
    static getMyCharacterFolders(owner: string): Promise<CharacterFoldersData> {
        return this.getData("bh-charfolders-" + owner);
    }
}

export default StorageService;