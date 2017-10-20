import Data from "./Data";
import MonsterListData from "./MonsterListData";

class MonsterEncounterData extends Data {
    constructor(storageId: string, name: string) {
        super(storageId);
        this.name = name;
        this.lists = undefined;
    }

    static savableClone(data: MonsterEncounterData) {
        return new MonsterEncounterData(data.storageId, data.name);
    }
}

export default MonsterEncounterData;