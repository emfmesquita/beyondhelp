import $ from "jquery";
import MonsterContentData from "./MonsterContentData";
import ParseData from "./ParseData";

const isOnMonsterList = function (path: string) {
    return path === "/monsters";
};

const isOnHomebrew = function (path: string) {
    return path.startsWith("/homebrew/");
};

const isOnMonsterDetail = function (path: string) {
    return path.startsWith("/monsters/");
};

const parseList = function (isHomebrew): ParseData[] {
    const parseDataArray = [];
    $(".more-info-monster:not(.bh-processed)").find(".mon-stat-block").each((idx, el) => {
        // gather monster info from page
        const moreInfoDiv = $(el).closest(".more-info-monster");
        moreInfoDiv.addClass("bh-processed");
        const rowDiv = moreInfoDiv.prev();

        const id = rowDiv.attr("data-slug");
        const nameSelector = isHomebrew ? ".list-row-col-name .list-row-name-primary-text" : ".monster-name a";
        const name = rowDiv.find(nameSelector).text().trim();

        const jqHpAttribute = moreInfoDiv.find(".mon-stat-block__attributes .mon-stat-block__attribute:nth-child(2)");
        const diceHp = jqHpAttribute.find(".mon-stat-block__attribute-data-extra").text().trim();
        const hp = jqHpAttribute.find(".mon-stat-block__attribute-data-value").text().trim();

        const monsterData = new MonsterContentData(id, name, hp, diceHp);

        // target
        const target = $(el);

        parseDataArray.push(new ParseData("before", target, monsterData));
    });
    return parseDataArray;
};

const parseDetail = function (): ParseData[] {
    const path = window.location.pathname;
    const id = path.substring(path.lastIndexOf("/") + 1);
    const name = $(".mon-stat-block__name-link").text().trim();

    const jqHpAttribute = $(".mon-stat-block__attributes .mon-stat-block__attribute:nth-child(2)");

    const diceHp = jqHpAttribute.find(".mon-stat-block__attribute-data-extra").text().trim();
    const hp = jqHpAttribute.find(".mon-stat-block__attribute-data-value").text().trim();

    return [new ParseData("before", $(".mon-stat-block"), new MonsterContentData(id, name, hp, diceHp))];
};

class ParseService {
    static parseMonsters(): ParseData[] {
        const path = window.location.pathname;

        const isMonsterList = isOnMonsterList(path);
        const isHomebrew = isOnHomebrew(path);
        if (isMonsterList || isHomebrew) {
            return parseList(isHomebrew);
        }

        if (isOnMonsterDetail(path)) {
            return parseDetail();
        }

        return [];
    }
}

export default ParseService;