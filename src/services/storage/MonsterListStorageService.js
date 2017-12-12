import MonsterEncounterData from '../../data/MonsterEncounterData';
import MonsterEncounterStorageService from "./MonsterEncounterStorageService";
import MonsterListData from '../../data/MonsterListData';
import Q from "./Q";
import StorageService from "./StorageService";

const getCurrentOrderValue = function (encounterId: string, storageData) {
    const lists = MonsterEncounterStorageService.getEncounterLists(encounterId, storageData);
    if (!lists || lists.length === 0) return 0;
    let maxOrder = 0;
    lists.forEach(list => {
        if (maxOrder < list.order) maxOrder = list.order;
    });
    return maxOrder + 1;
};

class MonsterListStorageService {
    static findList(storageId: string, storageData): MonsterListData {
        return StorageService.findSingle(storageData, Q.clazz("MonsterListData"), Q.eq("storageId", storageId));
    }

    static createList(name: string, monsterId: string, encounterId: string, storageData): Promise<MonsterListData> {
        const newList = new MonsterListData(null, encounterId, monsterId, name, 0);
        newList.order = getCurrentOrderValue(encounterId, storageData);
        return StorageService.createData("MonsterListData", newList);
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