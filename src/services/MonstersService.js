import LinkService from "./LinkService";
import MonsterEncounterData from "../data/MonsterEncounterData";
import MonsterListData from "../data/MonsterListData";

class MonstersService {
    static isCustom(list: MonsterListData): boolean {
        return list.monsterId.startsWith("bh-");
    }

    static notCustomMonsterLists(encounter: MonsterEncounterData): MonsterListData[] {
        if (!encounter || !encounter.lists || encounter.lists.length === 0) return [];
        return encounter.lists.filter(list => !MonstersService.isCustom(list));
    }

    static openDetailsPages(encounter: MonsterEncounterData) {
        MonstersService.notCustomMonsterLists(encounter).reverse().forEach(list => {
            LinkService.toNewTabHandler(`https://www.dndbeyond.com/monsters/${list.monsterId}`)();
        });
    }
}

export default MonstersService;