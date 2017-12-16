import MonsterEncounterData from '../../data/MonsterEncounterData';
import MonsterEncounterStorageService from "./MonsterEncounterStorageService";
import MonsterListData from '../../data/MonsterListData';
import Prefix from "./Prefix";
import Q from "./Q";
import StorageService from "./StorageService";

const getCurrentOrderValue = function (encounterId: string, storageData): number {
    const lists = MonsterEncounterStorageService.getEncounterLists(encounterId, storageData);
    if (!lists || lists.length === 0) return 0;
    let maxOrder = 0;
    lists.forEach(list => {
        if (maxOrder < list.order) maxOrder = list.order;
    });
    return maxOrder + 1;
};

const getCurrentOrderWithEncounter = function (encounter: MonsterEncounterData): number {
    if (!encounter.lists || encounter.lists.length === 0) return 0;
    const lastList = encounter.lists[encounter.lists.length - 1];
    return lastList.order + 1;
};

class MonsterListStorageService {
    static findList(storageId: string, storageData): MonsterListData {
        return StorageService.findSingle(storageData, Q.clazz("MonsterListData"), Q.eq("storageId", storageId));
    }

    static findListGroupedByEncounter(storageData): Promise<Map<string, MonsterListData[]>> {
        const listMap: Map<string, MonsterListData[]> = StorageService.findGroupedBy(storageData, "encounterId", Q.clazz("MonsterListData"));
        if (listMap.length === 0) {
            return Promise.resolve(listMap);
        }

        // check existing ordering info
        const firstList: MonsterListData = StorageService.findSingle(storageData, Q.clazz("MonsterListData"));
        let checkOrderPromise = Promise.resolve();
        if (firstList && (firstList.order === null || firstList.order === undefined)) {
            const toSaveLists = [];
            for (var encounterId of listMap.keys()) {
                let lists = listMap.get(encounterId);
                if (!lists || lists.length === 0) continue;
                lists = lists.sort((a: MonsterListData, b: MonsterListData) => a.name.localeCompare(b.name));
                lists.forEach((list, idx) => {
                    list.order = idx;
                    toSaveLists.push(list);
                });
            }
            checkOrderPromise = StorageService.updateData(toSaveLists);
        }

        return checkOrderPromise.then(() => listMap);
    }

    static createList(name: string, monsterId: string, encounterId: string, storageData): Promise<MonsterListData> {
        const newList = new MonsterListData(null, encounterId, monsterId, name, 0);
        newList.order = getCurrentOrderValue(encounterId, storageData);
        return StorageService.createData("MonsterListData", newList);
    }

    static createCustomList(name: string, hpexp: string, encounter: MonsterEncounterData): Promise<MonsterListData> {
        const newLisId = Prefix.createStorageId("MonsterListData");
        const customMonsterId = Prefix.createCustomMonsterId();
        const newList = new MonsterListData(newLisId, encounter.storageId, customMonsterId, name, 0);
        newList.order = getCurrentOrderWithEncounter(encounter);
        newList.hpexp = hpexp;
        return StorageService.createData(null, newList);
    }

    static deleteList(list: MonsterListData): Promise {
        if (!list) return Promise.resolve();
        const toDelete = [];
        toDelete.push(list);
        if (list.monsters) list.monsters.forEach(monster => toDelete.push(monster));
        return StorageService.deleteData(toDelete);
    }
}

export default MonsterListStorageService;