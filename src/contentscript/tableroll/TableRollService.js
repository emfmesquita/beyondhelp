import React, { Component } from 'react';

import $ from "jquery";
import DiceExp from "../../services/DiceExp";
import QTipService from "../QTipService";
import ReactDOM from 'react-dom';
import RollableData from "./RollableData";
import RollableTableData from "./RollableTableData";
import TableRollParseService from "./TableRollParseService";
import { throttle } from 'lodash';

/**
 * regex to catch normal values from cells
 */
const cellRegex = /^\s*[0-9]+\s*$/i;
/**
 * regex to catch range values from cells
 */
const cellRangeRegex = /^\s*[0-9]+\s*[-–]\s*[0-9]+\s*$/i;
/**
 * regex to catch value or more like: 
 *  16+
 *  16 or more
 *  16 or higher
 */
const cellValueOrMoreRegex = /^[0-9]+(( or more)|( or higher)|(\+))$/i;
/**
 * regex to catch value or lower like: 2 or lower
 */
const cellValueOrLowerRegex = /^[0-9]+ or lower$/i;

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
const initTable = function (table: HTMLElement, index: number) {
    const rollableTable = TableRollParseService.parse(table, index);
    if (!rollableTable) return;

    rollableTable.rolables.forEach(rollable => {
        ReactDOM.render(<ClickableRoller data={rollable} />, rollable.renderTarget);
    });
};

/**
 * Make a roll and show the result.
 */
const throttledRoll = throttle((data: RollableData, rollEl: HTMLElement) => {
    const jqRollEl = $(rollEl);
    const table = jqRollEl.closest("table");
    const rows = $(table).find("tbody tr");

    // remove the classes that indicates a roll result of all cells
    const cells = rows.find("td");
    cells.removeClass(ROLLED_LEFT_CLASS_NAME);
    cells.removeClass(ROLLED_RIGHT_CLASS_NAME);

    let found = false;

    // makes a roll and shows the tooltip
    const rolled = DiceExp.calcValue(data.diceValue);
    QTipService.animateIntoQTip(jqRollEl, rolled + "");

    // tries to find the cell with the rolled vavlue and show in it the result
    rows.each((index, row: HTMLElement) => {
        if (found) return;

        data.valuedColumns.forEach(columnIndex => {
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
};

/**
 * Calcs min and max values of a cell and add then as attributes.
 * @param {*} jqCell jquery object with a cell
 */
const processCell = function (jqCell) {
    // if it is not a value cell just returns
    let text: string = jqCell.text();
    text = text ? text.trim() : text;
    if (!text) return;

    const value: string = (text) => text === "00" ? "100" : text;

    // adds the value attributes for each type of value cell
    // normal: 22
    // range: 3-7
    // value or more: 16+, 16 or more, 16 or higher
    // value or lower: 2 or lower
    if (cellRegex.test(text)) {
        jqCell.attr(MIN_ATTR, value(text));
        jqCell.attr(MAX_ATTR, value(text));
    } else if (cellRangeRegex.test(text)) {
        const rangeValues = text.split(/[-–]/);
        jqCell.attr(MIN_ATTR, value(rangeValues[0]));
        jqCell.attr(MAX_ATTR, value(rangeValues[1]));
    } else if (cellValueOrMoreRegex.test(text)) {
        jqCell.attr(MIN_ATTR, value(text.split(/[ +]/)[0]));
        jqCell.attr(MAX_ATTR, "9999999999999");
    } else if (cellValueOrLowerRegex.test(text)) {
        jqCell.attr(MIN_ATTR, "1");
        jqCell.attr(MAX_ATTR, value(text.split(" ")[0]));
    }
};

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
        $("body.body-forum, body.body-user, body.body-devtracker").find("table.compendium-left-aligned-table:not(.mceLayout)").addClass("mceLayout");
        $("table:not(.bh-processed)").each((index, table) => initTable(table, index));
    }
}

class ClickableRoller extends Component {
    roll = () => {
        throttledRoll(this.props.data, this.rollEl);
    }

    render() {
        return (
            <span className="BH-Table-roll-dice" title="Click to Roll" onClick={this.roll} ref={(el) => { this.rollEl = el; }}>
                {this.props.data.text}
                <script />
            </span >
        );
    }
}

export default TableRollService;