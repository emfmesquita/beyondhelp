import Data from "./Data";
import MonsterListData from "./MonsterListData";

class MonsterEncounterData extends Data {
    constructor(storageId: string, name: string) {
        super(storageId);
        this.name = name;
        this.color = null;
        this.textColor = null;
        this.lists = [];
    }
}

export default MonsterEncounterData;