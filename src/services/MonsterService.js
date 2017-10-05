/* global chrome */

// filter monsters out the storage data and group them by id
const filterMonsters = function (storageData) {
    const grouped = {};
    Object.keys(storageData).map((storageId) => {
        if(!storageId || !storageId.startsWith("bh-monster-")) return;
        const monster = storageData[storageId];

        if(!grouped[monster.monsterId]){
            grouped[monster.monsterId] = [];
        }
        grouped[monster.monsterId].push(monster);
    });
    return grouped;
}


// update monster with set numbers on storage
const updateMonsters = function(monsters){
    return new Promise((resolve, reject) => {
        chrome.storage.sync.set(monsters, () => {
            chrome.runtime.lastError ? reject(chrome.runtime.lastError) : resolve();
        });
    });
}

class MonsterService {
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
                const monsters = [];

                // adds number property to monsters that do not have it
                Object.keys(grouped).map((monsterId) => {
                    if(!monsterId) return;
                    let lastNumber = 0;
                    grouped[monsterId].forEach((monster) => {
                        monsters.push(monster);
                        if(monster.number){
                            lastNumber = monster.number;
                            return;
                        };
                        lastNumber++;
                        monster.number = lastNumber;
                        toUpdate[monster.storageId] = monster;
                    });
                });

                // update monster with set numbers on storage
                updateMonsters(toUpdate).then(() => resolve(monsters)).catch(e => reject(e));
            });
        });
    }
}

export default MonsterService;