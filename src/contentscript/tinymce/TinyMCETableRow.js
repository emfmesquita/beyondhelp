import React, { Component } from 'react';
import { Glyphicon } from 'react-bootstrap';

import NumberField from "../../forms/NumberField";
import TextField from "../../forms/TextField";

class TinyMCETableRow extends Component {
    constructor(props) {
        super(props);
    }

    row = () => {
        return {
            from: this.props.from,
            to: this.props.to,
            result: this.props.result
        };
    }

    validateNumberCellHandler = (property: string) => {
        const number = Number.parseInt(this.props[property]);
        if (isNaN(number) || number < this.props.min || number > this.props.max) return "error";
        if (property === "from" && number !== this.props.expectedMin) return "error";
        if (property === "to") {
            const from = Number.parseInt(this.props.from);
            if (!isNaN(number) && number < from) return "error";
        }
        return "success";
    }

    changeHandler = (property: string) => {
        const handler = (e) => {
            const changedRow = this.row();
            changedRow[property] = e.target.value;
            this.props.onChange(changedRow);
        };
        return handler.bind(this);
    }

    scrollHandler = (property: string) => {
        const handler = (e) => {
            e.preventDefault();
            e.stopPropagation();

            const changedRow = this.row();

            let intValue = Number.parseInt(changedRow[property]);
            if (isNaN(intValue)) intValue = 0;

            const delta = e.deltaY;
            if (delta > 0 && intValue - 1 < this.props.min) return; // trying to lower beyond min
            if (delta <= 0 && intValue + 1 > this.props.max) return; // trying to higher beyond max

            let newValue;
            if (intValue < this.props.min) {
                newValue = this.props.min;
            } else if (intValue > this.props.max) {
                newValue = this.props.max;
            } else {
                newValue = intValue + (delta > 0 ? -1 : 1);
                if (newValue < this.props.min || newValue > this.props.max) return;
            }

            changedRow[property] = newValue;
            this.props.onChange(changedRow);
        };
        return handler.bind(this);
    }

    render() {
        return (
            <div>
                <NumberField
                    value={this.props.from}
                    onChange={this.changeHandler("from")} maxLength="5"
                    onWheel={this.scrollHandler("from")}
                    min={this.props.min} max={this.props.max}
                    validationState={this.validateNumberCellHandler("from")}
                    container={this}
                />
                <NumberField
                    label="–" value={this.props.to}
                    onChange={this.changeHandler("to")} maxLength="5"
                    onWheel={this.scrollHandler("to")}
                    min={this.props.min} max={this.props.max}
                    validationState={this.validateNumberCellHandler("to")}
                    container={this}
                />
                <TextField
                    className="bh-tables-result-column"
                    value={this.props.result}
                    onChange={this.changeHandler("result")} maxLength="200"
                    container={this}
                />
                <a href="javascript:void(0)" className="bh-tables-remove-row" onClick={this.props.onRemove} title="Remove Row" role="button">
                    <Glyphicon glyph="remove" />
                </a>
            </div>
        );
    }
}

export default TinyMCETableRow;