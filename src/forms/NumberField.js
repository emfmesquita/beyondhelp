import { FormControl, FormGroup } from 'react-bootstrap';
import React, { Component, WheelEvent } from "react";

import FieldLabel from "./FieldLabel";
import FieldService from "../services/FieldService";

class NumberField extends Component {
    changeHandler = this.props.onChange || FieldService.onChangeFunc(this.props.valuePropName, this.props.container);
    scrollHandler = this.props.onWheel || FieldService.onWheelFunc(this.props.valuePropName, this.props.container);

    render() {
        return (
            <span className={this.props.className}>
                <FieldLabel label={this.props.label} />
                <FormGroup bsSize="small" validationState={this.props.validationState}>
                    <FormControl
                        type="number"
                        style={{ height: "32px" }}
                        value={this.props.value}
                        onChange={this.changeHandler}
                        min={this.props.min} max={this.props.max}
                        onKeyDown={FieldService.onEnterFunc(this.props.onEnter, this.props.container)}
                        onWheel={this.scrollHandler}
                        placeholder={this.props.placeholder}
                        maxLength={this.props.maxLength}
                    />
                </FormGroup>
            </span>
        );
    }
}

export default NumberField;