import MonsterMetadata from "./MonsterMetadata";
import Data from "./Data";

class MonsterListData extends Data {
    constructor(storageId: string, name: string, active: boolean) {
        super(storageId);
        this.name = name;
        this.active = active;
    }

    static savableClone(data: MonsterListData) {
        return new MonsterListData(data.storageId, data.name, data.active);
    }

    get metadatas() {
        return this.metadatas;
    }

    set metadatas(value: MonsterMetadata[]) {
        this.metadatas = value;
    }
}

export default MonsterListData;