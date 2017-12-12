import MonsterListData from '../../data/MonsterListData';
import StorageService from "./StorageService";

class MonsterListStorageService {
    static deleteList(list: MonsterListData): Promise {
        const toDelete = [];
        toDelete.push(list);
        list.monsters.forEach(monster => toDelete.push(monster));
        return StorageService.deleteData(toDelete);
    }
}

export default MonsterListStorageService;