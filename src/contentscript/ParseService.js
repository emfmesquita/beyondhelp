import MonsterContentData from "./MonsterContentData";
import ParseData from "./ParseData";
import $ from "jquery";

const isOnMonsterList = function (path: string) {
    return path === "/monsters";
}

const isOnHomebrewMonsterList = function (path: string) {
    return path === "/homebrew/monsters";
}

const isOnMonsterDetail = function(path: string){
    return path.startsWith("/monsters/");
}

const parseList = function (isHomebrew): ParseData[] {
    const parseDataArray = [];
    $(".more-info-monster:not(.bh-processed").find(".ddb-statblock-monster:first").each((idx, el) => {
        // gather monster info from page
        const moreInfoDiv = $(el).closest(".more-info-monster");
        moreInfoDiv.addClass("bh-processed");
        const rowDiv = moreInfoDiv.prev();

        const id = rowDiv.attr("data-slug");
        const nameSelector = isHomebrew ? ".list-row-col-name .list-row-name-primary-text" : ".monster-name a";
        const name = rowDiv.find(nameSelector).text().trim();
        const diceHp = moreInfoDiv.find(".ddb-statblock-item-hit-points .secondary").text().trim();
        const hp = moreInfoDiv.find(".ddb-statblock-item-hit-points .primary").text().trim();
        const monsterData = new MonsterContentData(id, name, hp, diceHp);

        // target to prepend
        const moreInfoBody = $(el).closest(".more-info-body");

        parseDataArray.push(new ParseData(moreInfoBody, monsterData));
    });
    return parseDataArray;
}

const parseDetail = function(): ParseData[] {
    const path = window.location.pathname;
    const id = path.substring(path.lastIndexOf("/") + 1);
    const name = $(".monster-name").text().trim();

    const infoDiv = $(".monster-info");
    const diceHp = infoDiv.find(".hp .secondary").text().trim();
    const hp = infoDiv.find(".hp .primary").text().trim();

    return [new ParseData(infoDiv, new MonsterContentData(id, name, hp, diceHp))];
}

class ParseService {
    static parseMonsters(): ParseData[] {
        const path = window.location.pathname;

        const isMonsterList = isOnMonsterList(path);
        const isMonsterHomebrewList = isOnHomebrewMonsterList(path);
        if(isMonsterList || isMonsterHomebrewList){
            return parseList(isMonsterHomebrewList);
        }

        if(isOnMonsterDetail(path)){
            return parseDetail();
        }

        return [];
    }
}

export default ParseService;