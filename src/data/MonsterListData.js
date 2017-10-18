import Data from "./Data";
import MonsterMetadata from "./MonsterMetadata";

class MonsterListData extends Data {
    constructor(storageId: string, name: string, active: boolean) {
        super(storageId);
        this.name = name;
        this.active = active;
        this.metadatas = undefined;
    }

    static savableClone(data: MonsterListData) {
        return new MonsterListData(data.storageId, data.name, data.active);
    }
}

export default MonsterListData;