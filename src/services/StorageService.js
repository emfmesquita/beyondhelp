import Data from "../data/Data";
import MonsterData from '../data/MonsterData';
import MonsterEncounterData from '../data/MonsterEncounterData';
import MonsterMetadata from '../data/MonsterMetadata';

/* global chrome */

type StorageData = { [key: string]: Data }

class Prefix {
    static getStoragePrefix(dataClass: string) {
        switch (dataClass) {
            case "MonsterData":
                return "bh-monster-";
            case "MonsterMetadata":
                return "bh-monstermetadata-";
            case "MonsterEncounterData":
                return "bh-monsterencounter-";
            default:
                return undefined;
        }
    }

    static createStorageId(dataClass: string) {
        return Prefix.getStoragePrefix(dataClass) + new Date().getTime();
    }
}

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

const deleteData = function (data: Data): Promise<Data> {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.remove(data.storageId, (error) => {
            chrome.runtime.lastError ? reject(chrome.runtime.lastError) : resolve();
            chrome.runtime.sendMessage({ reload: true });
        });
    });
};

class StorageService {

    static createData(dataClass: sttring, data: Data): Promise {
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

    static updateData(data: Data): Promise {
        return this.createData(null, data);
    }

    static createMonster(monsterId: string, name: string, hp: string): Promise<MonsterData> {
        return new Promise((resolve, reject) => {
            chrome.storage.sync.get(null, (storageData: StorageData) => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                    return;
                }

                let encounter = findSingle(storageData, Q.clazz("MonsterEncounterData"), Q.eq("active", true));
                let encounterPromise = encounter ? Promise.resolve(encounter) : this.createData("MonsterEncounterData", new MonsterEncounterData(null, "default", true));

                let metadata = null;

                encounterPromise.then(foundEncounter => {
                    encounter = foundEncounter;
                    metadata = findSingle(storageData, Q.clazz("MonsterMetadata"), Q.eq("encounterId", encounter.storageId), Q.eq("monsterId", monsterId));
                    return metadata ? Promise.resolve(metadata) : this.createData("MonsterMetadata", new MonsterMetadata(null, encounter.storageId, monsterId, name, 0));
                }).then(foundMetadata => {
                    metadata = foundMetadata;
                    const newMonster = new MonsterData(null, metadata.storageId, hp, metadata.lastNumber + 1);
                    return this.createData("MonsterData", newMonster);
                }).then((monster) => {
                    metadata.lastNumber = metadata.lastNumber + 1;
                    return this.updateData(metadata).then(() => monster);
                }).then(resolve).catch(reject);
            });
        });
    }

    static getMonsterEncounters(): Promise<MonsterEncounterData[]> {
        return new Promise((resolve, reject) => {
            chrome.storage.sync.get(null, (storageData) => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                    return;
                }

                const encounters: MonsterEncounterData[] = find(storageData, Q.clazz("MonsterEncounterData"));
                if (encounters.length === 0) {
                    this.createData("MonsterEncounterData", new MonsterEncounterData(null, "default", true)).then(encounter => resolve([encounter])).catch(reject);
                    return;
                }

                const metadataMap: Map<string, MonsterMetadata[]> = findGroupedBy(storageData, "encounterId", Q.clazz("MonsterMetadata"));
                if (metadataMap.length === 0) {
                    return;
                }

                const monsterMap: Map<string, MonsterData[]> = findGroupedBy(storageData, "metadataId", Q.clazz("MonsterData"));
                metadataMap.forEach(metadatas => metadatas.forEach(metadata => metadata.monsters = monsterMap.get(metadata.storageId)));
                encounters.forEach(encounter => {
                    encounter.metadatas = metadataMap.get(encounter.storageId);
                    encounter.metadatas && encounter.metadatas.sort((a: MonsterMetadata, b: MonsterMetadata) => a.name.localeCompare(b.name));
                });
                resolve(encounters);
            });
        });
    }

    static deleteMonster(monster: MonsterData): Promise {
        return deleteData(monster).then(() => {
            return new Promise((resolve, reject) => {
                chrome.storage.sync.get(null, (storageData) => {
                    if (chrome.runtime.lastError) {
                        reject(chrome.runtime.lastError);
                        return;
                    }

                    const monsterOfSameMetadata = find(storageData, Q.clazz("MonsterData"), Q.eq("metadataId", monster.metadataId));
                    if (monsterOfSameMetadata.length > 0) {
                        resolve();
                        return;
                    }

                    const metadata = findSingle(storageData, Q.clazz("MonsterMetadata"), Q.eq("storageId", monster.metadataId));
                    metadata ? deleteData(metadata).then(resolve).catch(reject) : resolve();
                });
            });
        });
    }

    static countActiveMonsters(): Promise<{ alive: number, total: number }> {
        return new Promise((resolve, reject) => {
            chrome.storage.sync.get(null, (storageData) => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                    return;
                }

                const activeEncounter = findSingle(storageData, Q.clazz("MonsterEncounterData"), Q.eq("active", true));
                if (!activeEncounter) {
                    resolve(0);
                    return;
                }

                const metadatas = find(storageData, Q.clazz("MonsterMetadata"), Q.eq("encounterId", activeEncounter.storageId));
                if (metadatas.length === 0) {
                    resolve(0);
                    return;
                }

                const metaIds = metadatas.map(metadata => metadata.storageId);
                const monsters: MonsterData[] = find(storageData, Q.clazz("MonsterData"), Q.in("metadataId", metaIds));
                const total = monsters.length;
                const alive = monsters.filter(m => m.currentHp > 0).length;
                resolve({ total, alive });
            });
        });
    }
}

export default StorageService;