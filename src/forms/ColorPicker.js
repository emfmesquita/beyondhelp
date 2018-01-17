import "./ColorPicker.scss";

import { FormControl, InputGroup } from 'react-bootstrap';
import React, { Component } from "react";

import FieldLabel from "./FieldLabel";
import MonsterMenuButton from "../monsterbuttons/MonsterMenuButton";
import { SketchPicker } from "react-color";
import reactCSS from "reactcss";

class ColorPicker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            displayColorPicker: false
        };
    }

    render() {
        return (
            <span>
                <FieldLabel label={this.props.label} />
                <InputGroup bsSize="small" style={{ marginBottom: this.props.showPicker ? "300px" : "0px" }}>
                    <div className="Color-picker-container">
                        <div title="Click to Toggle Color Picker">
                            <div className="Color-picker-field" onClick={this.props.onTogglePicker}>
                                <div style={{ background: this.props.color }} />
                            </div>
                            {this.props.showPicker ? <div className="Color-picker">
                                <SketchPicker
                                    disableAlpha
                                    width={210}
                                    presetColors={this.props.presetColors}
                                    color={this.props.color || this.props.defaultColor}
                                    onChange={this.props.onChange}
                                />
                            </div> : null}
                        </div>
                        <MonsterMenuButton icon="glyphicon-erase" title="Erase" onClick={() => this.props.onChange({ hex: null })} />
                    </div>
                </InputGroup>
            </span>
        );
    }
}

export default ColorPicker;