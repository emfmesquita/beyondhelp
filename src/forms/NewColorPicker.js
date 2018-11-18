import "rc-color-picker/dist/rc-color-picker.css";
import "./NewColorPicker.scss";

import { FormControl, InputGroup } from 'react-bootstrap';
import React, { Component } from "react";

import FieldLabel from "./FieldLabel";
import MenuButton from "../buttons/MenuButton";
import { Panel as ColorPickerPanel } from "rc-color-picker";
import ColorPicker from "rc-color-picker";
import reactCSS from "reactcss";

class NewColorPicker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            displayColorPicker: false
        };
    }

    getMarginBottom = () => {
        if (!this.props.showPicker) return "0px";
        if (this.props.pickerHeight) return this.props.pickerHeight;
        return "272px";
    }

    getFieldClasses = () => {
        const color = this.props.color || this.props.defaultColor;
        return `Color-ncolorpicker-field ${color ? "Color-ncolorpicker-field-has-color" : ""}`
    }

    renderLabel = () => {
        if (this.props.label) return <FieldLabel label={this.props.label} />;
        return null;
    }

    renderPicker = () => {
        return <ColorPickerPanel enableAlpha={false} defaultColor={this.props.color || this.props.defaultColor} onChange={this.props.onChange} mode="RGB" />;
    }

    render() {
        return (
            <span>
                {this.renderLabel()}
                <InputGroup bsSize="small" style={{ marginBottom: this.getMarginBottom() }}>
                    <div className="Color-ncolorpicker-container">
                        <div title="Click to Toggle Color Picker">
                            <div className={this.getFieldClasses()} onClick={this.props.onTogglePicker}>
                                <div style={{ background: this.props.color }} />
                            </div>
                            {this.props.showPicker ? <div className="Color-ncolorpicker">
                                {this.renderPicker()}
                            </div> : null}
                        </div>
                        <MenuButton icon="glyphicon-erase" title="Erase" onClick={() => this.props.onChange({ hex: null })} />
                    </div>
                </InputGroup>
            </span>
        );
    }
}

export default NewColorPicker;