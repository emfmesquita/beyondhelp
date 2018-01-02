import $ from "jquery";
import Configuration from "../../data/Configuration";
import MonsterContentData from "./MonsterContentData";
import MonsterParseData from "./MonsterParseData";
import Opt from "../../Options";

const isOnMonsterList = function (path: string) {
    return path === "/monsters";
};

const isOnHomebrew = function (path: string) {
    return path.startsWith("/homebrew/");
};

const isOnMonsterDetail = function (path: string) {
    return path.startsWith("/monsters/");
};

const parseList = function (isHomebrew): MonsterParseData[] {
    const parseDataArray = [];
    $(".more-info-monster:not(.bh-processed)").find(".mon-stat-block").each((idx, el) => {
        // gathers monster info from page
        const moreInfoDiv = $(el).closest(".more-info-monster");

        // to not process the same monster twice
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

        parseDataArray.push(new MonsterParseData("before", target, monsterData));
    });
    return parseDataArray;
};

const parseDetail = function (): MonsterParseData[] {
    // to not process the same monster twice
    if ($(".mon-stat-block.bh-processed").length > 0) return [];
    $(".mon-stat-block").addClass("bh-processed");

    const path = window.location.pathname;
    const id = path.substring(path.lastIndexOf("/") + 1);
    const name = $(".mon-stat-block__name-link").text().trim();

    const jqHpAttribute = $(".mon-stat-block__attributes .mon-stat-block__attribute:nth-child(2)");

    const diceHp = jqHpAttribute.find(".mon-stat-block__attribute-data-extra").text().trim();
    const hp = jqHpAttribute.find(".mon-stat-block__attribute-data-value").text().trim();

    return [new MonsterParseData("before", $(".mon-stat-block"), new MonsterContentData(id, name, hp, diceHp))];
};

class MonsterParseService {
    static parseMonsters(config: Configuration): MonsterParseData[] {
        const path = window.location.pathname;
        const isMonsterList = isOnMonsterList(path);
        const isHomebrew = isOnHomebrew(path);

        if (isMonsterList && config[Opt.AddMonsterOnList]) {
            return parseList(isHomebrew);
        }

        if (isHomebrew && config[Opt.AddMonsterOnHomebrewList]) {
            return parseList(isHomebrew);
        }

        if (isOnMonsterDetail(path) && config[Opt.AddMonsterOnDetail]) {
            return parseDetail();
        }

        return [];
    }
}

export default MonsterParseService;
