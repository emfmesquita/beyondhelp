/**
 * Class that handles storage data ids prefixes.
 */
class Prefix {
    static getStoragePrefix(dataClass: string) {
        switch (dataClass) {
            case "MonsterData":
                return "bh-monster-";
            case "MonsterListData":
                return "bh-monsterlist-";
            case "MonsterEncounterData":
                return "bh-monsterencounter-";
            default:
                return undefined;
        }
    }

    static createStorageId(dataClass: string, increment: number) {
        if (dataClass === "Configuration") return ConfigurationId;
        if (!increment) {
            increment = 0;
        }
        return Prefix.getStoragePrefix(dataClass) + (new Date().getTime() + increment);
    }
}

export default Prefix;