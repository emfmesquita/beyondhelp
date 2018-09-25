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

const parseList = function (isHomebrew: boolean, addButton: boolean): MonsterParseData[] {
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

        const crLabel = moreInfoDiv.find(".mon-stat-block__tidbits  .mon-stat-block__tidbit-label:contains('Challenge')");
        const crText = crLabel.closest(".mon-stat-block__tidbit").find(".mon-stat-block__tidbit-data").text().trim();
        const cr = crText.split(" ")[0];

        const monsterData = new MonsterContentData(id, name, hp, diceHp, cr, addButton);

        // target
        const target = $(el);

        parseDataArray.push(new MonsterParseData("before", target, monsterData));
    });
    return parseDataArray;
};

const parseDetail = function (addButton: boolean): MonsterParseData[] {
    // to not process the same monster twice
    if ($(".mon-stat-block.bh-processed").length > 0) return [];
    $(".mon-stat-block").addClass("bh-processed");

    const path = window.location.pathname;
    const id = path.substring(path.lastIndexOf("/") + 1);
    const name = $(".mon-stat-block__name-link").text().trim();

    const jqHpAttribute = $(".mon-stat-block__attributes .mon-stat-block__attribute:nth-child(2)");
    const diceHp = jqHpAttribute.find(".mon-stat-block__attribute-data-extra").text().trim();
    const hp = jqHpAttribute.find(".mon-stat-block__attribute-data-value").text().trim();

    const crLabel = $(".mon-stat-block__tidbits  .mon-stat-block__tidbit-label:contains('Challenge')");
    const crText = crLabel.closest(".mon-stat-block__tidbit").find(".mon-stat-block__tidbit-data").text().trim();
    const cr = crText.split(" ")[0];

    return [new MonsterParseData("before", $(".mon-stat-block"), new MonsterContentData(id, name, hp, diceHp, cr, addButton))];
};

class MonsterParseService {
    static parseMonsters(config: Configuration): MonsterParseData[] {
        const path = window.location.pathname;
        const isMonsterList = isOnMonsterList(path);
        const isHomebrew = isOnHomebrew(path);

        if (isMonsterList) {
            return parseList(isHomebrew, config[Opt.AddMonsterOnList]);
        }

        if (isHomebrew) {
            return parseList(isHomebrew, config[Opt.AddMonsterOnHomebrewList]);
        }

        if (isOnMonsterDetail(path)) {
            return parseDetail(config[Opt.AddMonsterOnDetail]);
        }

        return [];
    }
}

export default MonsterParseService;
