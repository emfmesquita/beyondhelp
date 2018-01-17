import { Button, ButtonToolbar, Form } from 'react-bootstrap';
import React, { Component } from 'react';

import $ from "jquery";
import C from "../../Constants";
import DiceExp from "../../services/DiceExp";
import TextField from "../../forms/TextField";
import TinyMCETableRow from "./TinyMCETableRow";

const nextValue = function (lastRow, defaultValue: number, maxValue: number): number {
    const lastRowTo = Number.parseInt(lastRow.to);
    const safe = (value: number) => value > maxValue ? maxValue : value;
    if (!isNaN(lastRowTo)) return safe(lastRowTo + 1);
    const lastRowFrom = Number.parseInt(lastRow.from);
    if (!isNaN(lastRowFrom)) return safe(lastRowFrom + 1);
    return defaultValue;
};

const buildContent = function (diceExp: string, rows: object[]) {
    const formattedRows = rows.map(row => {
        const from = Number.parseInt(row.from);
        const to = Number.parseInt(row.to);
        const formattedRow = (() => {
            if (!isNaN(from) && !isNaN(to)) return from === to ? from + "" : `${from} – ${to}`;
            if (!isNaN(from)) return from + "";
            if (!isNaN(to)) return to + "";
            return "";
        })();

        return `
            <tr>
                <td>${formattedRow}</td><td>${row.result}</td>
            </tr>
        `;
    }).join("");

    return `
        <table class="compendium-left-aligned-table">
            <thead>
                <tr><th>${diceExp}</th><th>Result</th></tr>
            </thead>
            <tbody>
                ${formattedRows}
            </tbody>
        </table>
    `;
};

/**
 * Parses the existing table content to bh dialog.
 * @param {*} tableHtml 
 */
const parseTable = function (tableHtml) {
    if (!tableHtml) return { diceExp: "", rows: [] };

    const jqTable = $(tableHtml);
    const diceExp = jqTable.find("th:first").text().trim();
    const rows = [];
    jqTable.find("tbody tr").each((idx, tr) => {
        const jqTds = $(tr).find("td");
        const row = { from: "", to: "", result: "" };
        if (jqTds[0]) {
            const roll = jqTds[0].textContent.trim();
            const tokens = roll.split(/[-–]/i);
            const from = Number.parseInt(tokens[0]);
            row.from = isNaN(from) ? "" : from + "";
            if (tokens.length === 1) {
                row.to = row.from;
            } else {
                const to = Number.parseInt(tokens[1]);
                row.to = isNaN(to) ? "" : to + "";
            }
        }
        if (jqTds[1]) row.result = jqTds[1].innerHTML.trim();
        rows.push(row);
    });

    return { diceExp, rows };
};

class TinyMCETablesTab extends Component {
    constructor(props) {
        super(props);

        this.state = parseTable(props.tableHtml);
    }

    isDiceExpValid = () => {
        return DiceExp.isDiceExp(this.state.diceExp) && this.state.diceExp.toLowerCase().indexOf("d") >= 0;
    }

    isDiceExpPositive = () => {
        return this.isDiceExpValid() && DiceExp.calcMinValue(this.state.diceExp) >= 0;
    }

    addAndClose = () => {
        if (!this.isDiceExpPositive()) return;
        this.props.onAdd(buildContent(this.state.diceExp, this.state.rows));
        this.props.onClose();
    }

    update = () => {
        window.top.postMessage({
            action: C.UpdateSelectedTableTinyMessage,
            content: buildContent(this.state.diceExp, this.state.rows).trim()
        }, "*");
    }

    addRow = () => {
        const minValue = DiceExp.calcMinValue(this.state.diceExp);
        const maxValue = DiceExp.calcMaxValue(this.state.diceExp);
        let startValue = minValue;
        let currentIndex = this.state.rows.length - 1;
        startValue = (() => {
            while (currentIndex >= 0) {
                const row = this.state.rows[currentIndex];
                const value = nextValue(row, null, maxValue);
                if (value !== null) return value;
                currentIndex--;
            }
            return startValue;
        })();
        this.state.rows.push({
            from: startValue + "",
            to: startValue + "",
            result: ""
        });
        this.setState({ rows: this.state.rows });
    }

    removeRowHandler = (idx: number) => {
        const handler = () => {
            this.state.rows.splice(idx, 1);
            this.setState({ rows: this.state.rows });
        };
        return handler.bind(this);
    }

    validateDiceExpression = () => {
        return this.isDiceExpPositive() ? "success" : "error";
    }

    rowChangeHandler = (idx: number) => {
        const handler = function (row) {
            const rows = this.state.rows;
            rows[idx] = row;
            this.setState({ rows });
        };
        return handler.bind(this);
    }

    renderMinMaxValue = () => {
        if (!this.isDiceExpValid()) return <div className="bh-tables-min-max">Min: N/A&nbsp;&nbsp;&nbsp;&nbsp;Max: N/A</div>;
        return <div className="bh-tables-min-max">Min: {DiceExp.calcMinValue(this.state.diceExp)}&nbsp;&nbsp;&nbsp;&nbsp;Max: {DiceExp.calcMaxValue(this.state.diceExp)}</div>;
    }

    renderRows = () => {
        const diceValid = this.isDiceExpValid();
        const diceMin = diceValid ? DiceExp.calcMinValue(this.state.diceExp) : 0;
        const min = diceMin > 0 ? diceMin : 0;
        let expectedMin = min;
        const max = diceValid ? DiceExp.calcMaxValue(this.state.diceExp) : Number.MAX_SAFE_INTEGER;
        return this.state.rows.map((rowData, idx) => {
            const onRemove = this.removeRowHandler(idx);
            if (idx > 0) expectedMin = nextValue(this.state.rows[idx - 1], expectedMin, max);
            return <TinyMCETableRow key={idx} from={rowData.from} to={rowData.to} result={rowData.result} min={min} max={max} expectedMin={expectedMin} onChange={this.rowChangeHandler(idx)} onRemove={onRemove} />;
        });
    }

    renderAddButton = () => {
        if (this.props.tableHtml) return (
            <Button bsStyle="primary" disabled={!this.isDiceExpPositive()} onClick={this.update}>
                Update
            </Button>
        );
        return (
            <Button bsStyle="primary" disabled={!this.isDiceExpPositive()} onClick={this.addAndClose}>
                Add and Close
            </Button>
        );
    }

    render() {
        return (
            <div>
                <Form inline className="bh-content-panel bh-tables-tab">
                    <TextField
                        label="Dice Expression" value={this.state.diceExp}
                        valuePropName="diceExp" maxLength="25"
                        validationState={this.validateDiceExpression()}
                        onEnter={this.addRow}
                        container={this} placeholder="E.g.: 3d6 + 2"
                    />
                    <Button className="bh-tables-add-row" bsSize="xsmall" disabled={!this.isDiceExpPositive()} onClick={this.addRow}>Add Row</Button>
                    <div className="bh-tables-rows">
                        {this.renderRows()}
                    </div>
                    {this.renderMinMaxValue()}
                </Form>

                <ButtonToolbar className="bh-button-toolbar">
                    {this.renderAddButton()}
                    <Button onClick={this.props.onClose}>
                        Close
                    </Button>
                </ButtonToolbar>
            </div>
        );
    }
}

export default TinyMCETablesTab;