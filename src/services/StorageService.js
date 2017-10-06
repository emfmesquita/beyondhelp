import MonsterData from '../data/MonsterData'
/* global chrome */

/**
 * Filter monsters out the storage data and group them by id.
 * @param {*} storageData
 * @returns {*}
 */
const filterMonsters = function (storageData) {
    const grouped = {};
    Object.keys(storageData).forEach((storageId) => {
        if (!storageId || !storageId.startsWith("bh-monster-")) return;
        const monster = storageData[storageId];

        if (!grouped[monster.monsterId]) {
            grouped[monster.monsterId] = [];
        }
        grouped[monster.monsterId].push(monster);
    });
    return grouped;
}

/**
 * Adds number property to monsters that do not have it
 * @param {*} grouped
 * @param {*} toUpdate 
 * @returns {MonsterData[]}
 */
const addNumbers = function (grouped, toUpdate) {
    const monsters = [];

    // adds number property to monsters that do not have it
    Object.keys(grouped).forEach((monsterId) => {
        if (!monsterId) return;
        let lastNumber = 0;
        grouped[monsterId].forEach((monster) => {
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
 * @param {*} monsters 
 */
const updateMonsters = function (monsters) {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.set(monsters, () => {
            chrome.runtime.lastError ? reject(chrome.runtime.lastError) : resolve();
        });
    });
}

class StorageService {

    /**
     * Gets all monsters from the storage. Alsso addds numbers on them if they don't have it.
     * @returns {Promise<MonsterData[]>}
     */
    static getMonstersFromStorage() {
        return new Promise((resolve, reject) => {
            chrome.storage.sync.get(null, (storageData) => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                    return;
                }

                // filter monsters out the storage data and group them by id
                const grouped = filterMonsters(storageData);
                const toUpdate = {};

                // adds number property to monsters that do not have it
                const monsters = addNumbers(grouped, toUpdate);

                // update monster with set numbers on storage
                updateMonsters(toUpdate).then(() => resolve(monsters)).catch(e => reject(e));
            });
        });
    }

    /**
     * Updates monster on storage.
     * @param {MonsterData} monster 
     */
    static updateMonster(monster){
        return new Promise((resolve, reject) => {
            const storageEntry = {};
            storageEntry[monster.storageId] = monster;
            chrome.storage.sync.set(storageEntry, () => {
                chrome.runtime.lastError ? reject(chrome.runtime.lastError) : resolve();
            });
        });
    }
}

export default StorageService;