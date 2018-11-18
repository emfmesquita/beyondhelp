import React, { Component } from "react";

import C from "../../Constants";
import NewColorPicker from "../../forms/NewColorPicker";
import FieldService from "../../services/FieldService";

class ColorPickerWidget extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showColorPicker: false
        };
    }

    onColorChange = (e) => {
        this.props.onChange(e.color || "");
    }

    render() {
        return (
            <div className="BH-color-slider-widget">
                <NewColorPicker
                    showPicker={this.state.showColorPicker}
                    pickerHeight={this.props.options.pickerHeight}
                    onTogglePicker={FieldService.onToggleFunc("showColorPicker", this)}
                    color={this.props.value}
                    onChange={this.onColorChange}
                />
            </div>
        );
    }
}

export default ColorPickerWidget;