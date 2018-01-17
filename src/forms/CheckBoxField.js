import "./CheckBoxField.scss";

import { Checkbox, FormGroup } from 'react-bootstrap';
import React, { Component } from "react";

import FieldLabel from "./FieldLabel";

class CheckBoxField extends Component {
    render() {
        return (
            <span className={this.props.className}>
                {this.props.label && <FieldLabel label={this.props.label} />}
                <FormGroup bsSize="small">
                    <Checkbox onChange={this.props.onChange} checked={this.props.value}>{this.props.checkText}</Checkbox>
                </FormGroup>
            </span>
        );
    }
}

export default CheckBoxField;