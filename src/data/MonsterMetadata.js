import Data from "./Data";
import MonsterData from "./MonsterData";

class MonsterMetadata extends Data {
    constructor(storageId: string, encounterId: string, monsterId: string, name: string, lastNumber: number) {
        super(storageId);
        this.encounterId = encounterId;
        this.monsterId = monsterId;
        this.name = name;
        this.lastNumber = lastNumber;
        this.collapsed = false;
    }

    static savableClone(data: MonsterMetadata) {
        const clone = new MonsterMetadata(data.storageId, data.encounterId, data.monsterId, data.name, data.lastNumber);
        clone.collapsed = data.collapsed;
        return clone;
    }

    get monsters() {
        return this.monsters;
    }

    set monsters(value: MonsterData[]) {
        this.monsters = value;
    }
}

export default MonsterMetadata;