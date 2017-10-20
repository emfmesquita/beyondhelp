import Data from "./Data";
import MonsterMetadata from "./MonsterMetadata";

class MonsterEncounterData extends Data {
    constructor(storageId: string, name: string, active: boolean) {
        super(storageId);
        this.name = name;
        this.active = active;
        this.metadatas = undefined;
    }

    static savableClone(data: MonsterEncounterData) {
        return new MonsterEncounterData(data.storageId, data.name, data.active);
    }
}

export default MonsterEncounterData;