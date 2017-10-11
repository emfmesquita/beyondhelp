import MonsterData from "./MonsterData";
import Data from "./Data";

class MonsterMetadata extends Data {
    constructor(storageId: string, listId: string, monsterId: string, name: string, lastNumber: number) {
        super(storageId);
        this.listId = listId;
        this.monsterId = monsterId;
        this.name = name;
        this.lastNumber = lastNumber;
        this.collapsed = false;
    }

    static savableClone(data: MonsterMetadata) {
        return new MonsterMetadata(data.storageId, data.listId, data.monsterId, data.name, data.lastNumber);
    }

    get monsters() {
        return this.monsters;
    }

    set monsters(value: MonsterData[]) {
        this.monsters = value;
    }
}

export default MonsterMetadata;