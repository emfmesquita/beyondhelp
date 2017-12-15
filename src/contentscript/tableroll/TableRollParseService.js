import $ from "jquery";
import DiceExp from "../../services/DiceExp";
import React from 'react';
import RollableData from "./RollableData";
import RollableTableData from "./RollableTableData";

const checkSpecial = function (firstColumnHeaderText, expectedHeader, expectedPath) {
    return firstColumnHeaderText === expectedHeader && window.location.pathname === expectedPath;
};

const basicTable = function (firstColumnHeaderText: string, firstColumnHeader: HTMLElement, diceValue: string) {
    return new RollableTableData([new RollableData(firstColumnHeaderText, diceValue, [0], firstColumnHeader)]);
};

const parseSpecialTables = function (firstColumnHeaderText: string, jqTable, index: number) {
    const columnHeaders = jqTable.find("th, thead td").get();
    if (checkSpecial(firstColumnHeaderText, "d12 Roll", "/compendium/adventures/lmop/wave-echo-cave")) {
        return basicTable(firstColumnHeaderText, columnHeaders[0], "d12");
    } else if (checkSpecial(firstColumnHeaderText, "Day Roll", "/compendium/adventures/lmop/the-spiders-web")) {
        return new RollableTableData([
            new RollableData("Day Roll", "d12", [0], columnHeaders[0]),
            new RollableData("Night Roll", "d12", [1], columnHeaders[1])
        ]);
    } else if (checkSpecial(firstColumnHeaderText, "Day", "/compendium/adventures/pota/the-dessarin-valley")) {
        return new RollableTableData([
            new RollableData("Day", "d12 + d8", [0], columnHeaders[0]),
            new RollableData("Night", "d12 + d8", [1], columnHeaders[1])
        ]);
    } else if (checkSpecial(firstColumnHeaderText, "Roll", "/compendium/adventures/pota/the-dessarin-valley")) {
        return basicTable(firstColumnHeaderText, columnHeaders[0], "d12 + d8");
    } else if (checkSpecial(firstColumnHeaderText, "Encounter", "/compendium/adventures/skt/the-savage-frontier")) {
        return new RollableTableData([
            new RollableData("Forest", "d100", [1], columnHeaders[1]),
            new RollableData("Grassland", "d100", [2], columnHeaders[2]),
            new RollableData("Hills/ Moors", "d100", [3], columnHeaders[3]),
            new RollableData("Mountains", "d100", [4], columnHeaders[4]),
            new RollableData("Road/ Trail", "d100", [5], columnHeaders[5]),
            new RollableData("Sea", "d100", [6], columnHeaders[6]),
            new RollableData("Tundra", "d100", [7], columnHeaders[7])
        ]);
    } else if (checkSpecial(firstColumnHeaderText, "Encounter", "/compendium/adventures/toa/random-encounters")) {
        if (index === 6) {
            return new RollableTableData([
                new RollableData("Ruins", "d100", [1], columnHeaders[1]),
                new RollableData("Palace", "d100", [2], columnHeaders[2]),
                new RollableData("Swamp", "d100", [3], columnHeaders[3])
            ]);
        }
    } else if (checkSpecial(firstColumnHeaderText, "Encounter", "/compendium/rules/ttp/the-tortle-package")) {
        return new RollableTableData([
            new RollableData("Land", "d100", [1], columnHeaders[1]),
            new RollableData("Water", "d100", [2], columnHeaders[2])
        ]);
    } else if (checkSpecial(firstColumnHeaderText, "d100*", "/compendium/rules/xgte/character-options-this-is-your-life")) {
        return basicTable(firstColumnHeaderText, columnHeaders[0], "d100");
    } else if (checkSpecial(firstColumnHeaderText, "3d6 +Cha mod", "/compendium/rules/xgte/character-options-this-is-your-life")) {
        const headerContent = <span>{"3d6 +"} < br /> {"Cha mod"}</span>;
        return basicTable(headerContent, columnHeaders[0], "3d6");
    } else if (checkSpecial(firstColumnHeaderText, "d100 + Level", "/compendium/rules/dmg/between-adventures")) {
        return basicTable(firstColumnHeaderText, columnHeaders[0], "d100");
    } else if (checkSpecial(firstColumnHeaderText, "d100 + Days", "/compendium/rules/dmg/between-adventures")) {
        return basicTable(firstColumnHeaderText, columnHeaders[0], "d100");
    } else if (checkSpecial(firstColumnHeaderText, "d100 + Mod.", "/compendium/rules/dmg/between-adventures")) {
        return basicTable(firstColumnHeaderText, columnHeaders[0], "d100");
    } else if (checkSpecial(firstColumnHeaderText, "Check Total", "/compendium/rules/xgte/dungeon-masters-tools")) {
        return basicTable(firstColumnHeaderText, columnHeaders[0], "d20");
    } else if (checkSpecial(firstColumnHeaderText, "d12/d20", "/compendium/rules/dmg/appendix-a-random-dungeons")) {
        const firstRollableContaier = $("<span></span>");
        const secondRollableContaier = $("<span></span>");
        const jqFirstColumnHeader = $(columnHeaders[0]);
        jqFirstColumnHeader.empty();
        jqFirstColumnHeader.append(firstRollableContaier).append("/").append(secondRollableContaier);
        return new RollableTableData([
            new RollableData("d12", "d12", [0], firstRollableContaier[0]),
            new RollableData("d20", "d20", [0], secondRollableContaier[0])
        ]);
    } else if (checkSpecial(firstColumnHeaderText, "d6 (d8)", "/compendium/adventures/pota/secret-of-the-sumber-hills")) {
        const firstRollableContaier = $("<span></span>");
        const secondRollableContaier = $("<span></span>");
        const jqFirstColumnHeader = $(columnHeaders[0]);
        jqFirstColumnHeader.empty();
        jqFirstColumnHeader.append(firstRollableContaier).append(" (").append(secondRollableContaier).append(")");
        return new RollableTableData([
            new RollableData("d6", "d6", [0], firstRollableContaier[0]),
            new RollableData("d8", "d8", [0], secondRollableContaier[0])
        ]);
    } else if (checkSpecial(firstColumnHeaderText, "d8", "/compendium/adventures/oota/audience-in-gauntlgrym")) {
        return basicTable("d20", columnHeaders[0], "d20");
    }
    return null;
};

class TableRollParseService {
    static parse(table: HTMLElement, index: number): RollableTableData {
        const jqTable = $(table);
        jqTable.addClass("bh-processed");

        const jqFirstColumnHeader = jqTable.find("th:first-child, thead td:first-child");
        let firstColumnHeaderText = jqFirstColumnHeader.text();
        firstColumnHeaderText = firstColumnHeaderText ? firstColumnHeaderText.trim() : firstColumnHeaderText;

        // no heaser on first column not a rollable table
        if (!firstColumnHeaderText) return null;

        // checks for especial tables - returns it if found
        const specialTable = parseSpecialTables(firstColumnHeaderText, jqTable, index);
        if (specialTable) return specialTable;

        // commons table if not a dice expression is not a rollable table
        if (!DiceExp.isDiceExp(firstColumnHeaderText)) return null;

        // check which columns contains cells with values by checking which columns have the same text as the first one
        const valuedColumns = [];
        const headers = jqTable.find("th, thead td");
        headers.each((index, header) => {
            let text = header.innerText;
            text = text ? text.trim() : text;
            if (text === firstColumnHeaderText) {
                valuedColumns.push(index);
            }
        });

        const rollable = new RollableData(firstColumnHeaderText, firstColumnHeaderText, valuedColumns, jqFirstColumnHeader[0]);
        return new RollableTableData([rollable]);
    }
}

export default TableRollParseService;