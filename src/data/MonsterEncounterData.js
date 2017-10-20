import Data from "./Data";
import MonsterListData from "./MonsterListData";

class MonsterEncounterData extends Data {
    constructor(storageId: string, name: string, active: boolean) {
        super(storageId);
        this.name = name;
        this.active = active;
        this.lists = undefined;
    }

    static savableClone(data: MonsterEncounterData) {
        return new MonsterEncounterData(data.storageId, data.name, data.active);
    }
}

export default MonsterEncounterData;