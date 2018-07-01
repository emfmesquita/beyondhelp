
import C from "../../Constants";

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
            case "ExtraMapRefsData":
                return "bh-extramaprefs-";
            case "PlayByPostData":
                return C.PbpRefsId;
            default:
                return undefined;
        }
    }

    static createStorageId(dataClass: string, increment: number) {
        if (dataClass === "Configuration") return C.ConfigurationId;
        if (dataClass === "PlayByPostData") return C.PbpRefsId;
        if (!increment) {
            increment = 0;
        }
        return Prefix.getStoragePrefix(dataClass) + (new Date().getTime() + increment);
    }

    static createCustomMonsterId() {
        return "bh-custom-" + new Date().getTime();
    }
}

export default Prefix;