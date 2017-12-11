import Data from "./Data";
import MonsterData from "./MonsterData";

class MonsterListData extends Data {
    constructor(storageId: string, encounterId: string, monsterId: string, name: string, lastNumber: number) {
        super(storageId);
        this.encounterId = encounterId;
        this.monsterId = monsterId;
        this.name = name;
        this.lastNumber = lastNumber;
        this.order = 0;
        this.collapsed = false;
        this.color = null;
        this.textColor = null;
        this.headerColor = null;
    }

    get monsters() {
        return this.monsters;
    }

    set monsters(value: MonsterData[]) {
        this.monsters = value;
    }
}

export default MonsterListData;