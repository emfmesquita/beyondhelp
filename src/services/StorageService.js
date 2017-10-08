import MonsterData from '../data/MonsterData'
/* global chrome */

type StorageData = { [key: string]: MonsterData }

/**
 * Filter monsters out the storage data, group them by id and sort them by name.
 */
const filterMonsters = function (storageData: StorageData): MonsterData[][] {
    const grouped = {};
    // group by id
    Object.keys(storageData).forEach((storageId) => {
        if (!storageId || !storageId.startsWith("bh-monster-")) return;
        const monster = storageData[storageId];

        if (!grouped[monster.monsterId]) {
            grouped[monster.monsterId] = [];
        }
        grouped[monster.monsterId].push(monster);
    });

    // sort by name
    const sorted: MonsterData[][] = Object.keys(grouped).map((monsterId) => grouped[monsterId]);
    sorted.sort(([a: MonsterData], [b: MonsterData]) => a.name.localeCompare(b.name));
    return sorted;
}

/**
 * Adds number property to monsters that do not have it
 */
const addNumbers = function (grouped: MonsterData[][], toUpdate: StorageData) {
    const monsters: MonsterData[] = [];
    grouped.forEach((monstersOfSameType) => {
        let lastNumber = 0;
        monstersOfSameType.forEach((monster) => {
            monsters.push(monster);
            if (monster.number) {
                lastNumber = monster.number;
                return;
            };
            lastNumber++;
            monster.number = lastNumber;
            toUpdate[monster.storageId] = monster;
        });
    });
    return monsters;
}

/**
 * Update monsters with set numbers on storage.
 */
const updateMonsters = function (toUpdate: StorageData) {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.set(toUpdate, () => {
            chrome.runtime.lastError ? reject(chrome.runtime.lastError) : resolve();
        });
    });
}

class StorageService {

    /**
     * Gets all monsters from the storage. Alsso addds numbers on them if they don't have it.
     */
    static getMonstersFromStorage(): Promise<MonsterData[]> {
        return new Promise((resolve, reject) => {
            chrome.storage.sync.get(null, (storageData) => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                    return;
                }

                const grouped = filterMonsters(storageData);
                const toUpdate = {};
                const monsters = addNumbers(grouped, toUpdate);
                updateMonsters(toUpdate).then(() => resolve(monsters)).catch(e => reject(e));
            });
        });
    }

    /**
     * Updates monster on storage.
     */
    static updateMonster(monster: MonsterData) {
        return new Promise((resolve, reject) => {
            const storageEntry: StorageData = {};
            storageEntry[monster.storageId] = monster;
            chrome.storage.sync.set(storageEntry, () => {
                chrome.runtime.lastError ? reject(chrome.runtime.lastError) : resolve();
            });
        });
    }
}

export default StorageService;