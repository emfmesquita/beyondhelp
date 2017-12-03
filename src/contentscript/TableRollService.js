import React, { Component } from 'react';

import $ from "jquery";
import DiceExp from "../services/DiceExp"
import ReactDOM from 'react-dom';
import { throttle } from 'lodash';

/**
 * regex to catch normal and reange values from cells
 */
const cellRegex = /^[0-9]+([-–][0-9]+)?$/i
/**
 * regex to catch normal value or more like: 16+
 */
const cellValueOrMoreRegex = /^[0-9]+\+$/i
/**
 * regex to split range values
 */
const cellSplitRegex = /[-–]/

/**
 * special case of lmop
 */
const ROLL_12_SPECIAL = "d12 Roll";

/**
 * class that add the rolled border left for the first column
 */
const ROLLED_LEFT_CLASS_NAME = "BH-Table-roll-cell-left";
/**
 * class that add the rolled border right for the other but applied on the previous sibling column
 */
const ROLLED_RIGHT_CLASS_NAME = "BH-Table-roll-cell-right";

/**
 * attr name of pre calculated cell value min
 */
const MIN_ATTR = "bh-roll-min";
/**
 * attr name of pre calculated cell value max
 */
const MAX_ATTR = "bh-roll-max";


/**
 * Inits the table rendering the clickable div, only for top left cells that are dice expressions.
 * @param {HTMLElement} table table element
 */
const initTable = function (table: HTMLElement) {
    const jqTable = $(table);
    jqTable.addClass("bh-processed");
    const diceHeader = jqTable.find("th:first-child, thead td:first-child");
    let diceText = diceHeader.text();
    diceText = diceText ? diceText.trim() : diceText;
    if (!diceText || (!DiceExp.isDiceExp(diceText) && diceText !== ROLL_12_SPECIAL)) return;
    ReactDOM.render(<ClickableRoller text={diceText} />, diceHeader.get()[0]);
};

/**
 * Make a roll and show the result.
 */
const throttledRoll = throttle((baseText, rollDiv) => {
    const jqRollDiv = $(rollDiv);
    const table = jqRollDiv.closest("table");
    const rows = $(table).find("tbody tr");

    // check which columns contains cells with values
    // by checking which columns have the same text as the first one
    const valuedColumns = [];
    const headers = table.find("th, thead td");
    headers.each((index, header) => {
        let text = header.innerText;
        text = text ? text.trim() : text;
        if (text === baseText) {
            valuedColumns.push(index);
        }
    });

    // remove the classes that indicates a roll result of all cells
    const cells = rows.find("td");
    cells.removeClass(ROLLED_LEFT_CLASS_NAME);
    cells.removeClass(ROLLED_RIGHT_CLASS_NAME);

    const textToCalc = baseText === ROLL_12_SPECIAL ? "d12" : baseText;

    let found = false;

    // makes a roll and shows the tooltip
    const rolled = DiceExp.calcValue(textToCalc);
    jqRollDiv.hide();
    jqRollDiv.fadeIn(300);
    const id = "bh-table-roll-" + new Date().getTime();
    jqRollDiv.attr("id", id);
    showQtip(jqRollDiv, id, rolled);

    // tries to find the cell with the rolled vavlue and show in it the result
    rows.each((index, row: HTMLElement) => {
        if (found) return;

        valuedColumns.forEach(columnIndex => {
            if (found) return;
            found = checkCell(row, columnIndex, rolled);
        });
    });
}, 500);

/**
 * Checks if a cell is the corresponding result of rolled value.
 * @param {HTMLElement} row row element
 * @param {number} columnIndex index of the cell column to check
 * @param {number} rolled the dice rolled value
 */
const checkCell = function (row: HTMLElement, columnIndex: number, rolled: number): boolean {
    const jqRow = $(row);
    const jqCell = jqRow.find(`td:nth-child(${columnIndex + 1})`);

    // if the cell does not have pre calculated values calculates it
    if (jqCell.attr(MIN_ATTR) === undefined) {
        processCell(jqCell);
    }
    // if the cell still does not have it is not a value cell
    if (jqCell.attr(MIN_ATTR) === undefined) return false;

    const min = jqCell.attr(MIN_ATTR);
    const max = jqCell.attr(MAX_ATTR);
    if (rolled < min || rolled > max) return false;

    // if the rolled value it is in the range adds the classes with border change to show the result
    // for the first column add as a left border
    // for the others adds as a right border of the previous sibling
    const className = columnIndex === 0 ? ROLLED_LEFT_CLASS_NAME : ROLLED_RIGHT_CLASS_NAME;
    const jqCellToApply = columnIndex === 0 ? jqCell : jqRow.find(`td:nth-child(${columnIndex})`);
    jqCellToApply.addClass(className);
    return true;
}

/**
 * Calcs min and max values of a cell and add then as attributes.
 * @param {*} jqCell jquery object with a cell
 */
const processCell = function (jqCell) {
    // if it is not a value cell just returns
    let text: string = jqCell.text();
    text = text ? text.trim() : text;
    if (!text) return;

    const isNormalOrRange = cellRegex.test(text);
    const isValueOrMore = cellValueOrMoreRegex.test(text);
    if (!isNormalOrRange && !isValueOrMore) return;

    // adds the value attributes for each type of value cell
    // normal: 22
    // range: 3-7
    // value or more: 16+
    if (isNormalOrRange) {
        const rangeValues = text.split(cellSplitRegex);
        const value: string = (text) => text === "00" ? "100" : text;
        if (rangeValues.length === 1) {
            jqCell.attr(MIN_ATTR, value(rangeValues[0]));
            jqCell.attr(MAX_ATTR, value(rangeValues[0]));
        } else if (rangeValues.length === 2) {
            jqCell.attr(MIN_ATTR, value(rangeValues[0]));
            jqCell.attr(MAX_ATTR, value(rangeValues[1]));
        }
    }
    if (isValueOrMore) {
        jqCell.attr(MIN_ATTR, text.substr(0, text.length - 1));
        jqCell.attr(MAX_ATTR, "9999999999999");
    }
}

/**
 * Shows a tooltip with the reolled result.
 * @param {*} target jquery object with the target to show the tooltip
 * @param {*} targetId id of the target to sohw the tooltip
 * @param {*} rolled rolled dice value
 */
const showQtip = function (target, targetId: string, rolled: number) {
    const qtipOptions = {
        content: "" + rolled,
        show: { event: "none", effect: true, ready: true },
        hide: { event: "unfocus", effect: true },
        position: {
            my: "bottom center",
            at: "top center"
        },
        style: { classes: "qtip-light BH-Table-roll-tip" }
    };
    const qtipOptionsString = JSON.stringify(qtipOptions);
    // adds a script to run on the ddb page that adds the tooltip
    target.find("script").replaceWith(`<script>jQuery("#${targetId}").qtip(${qtipOptionsString})</script>`);
};

class TableRollService {
    static init() {
        $("table:not(.bh-processed)").each((index, table) => initTable(table));
    }
}

class ClickableRoller extends Component {
    constructor(props) {
        super(props);
        this.roll = this.roll.bind(this);
    }

    roll() {
        throttledRoll(this.props.text, this.rollDiv);
    }

    render() {
        return (
            <div className="BH-Table-roll-dice" title="Click to Roll" onClick={this.roll} ref={(divEl) => { this.rollDiv = divEl; }}>
                {this.props.text}
                <script />
            </div >
        );
    }
}

export default TableRollService;