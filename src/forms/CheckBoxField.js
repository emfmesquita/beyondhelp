import { Checkbox, FormGroup } from 'react-bootstrap';
import React, { Component } from "react";

import FieldLabel from "./FieldLabel";

class CheckBoxField extends Component {
    style = () => ({ marginLeft: `${(this.props.level || 0) * 20}px` });

    render() {
        return (
            <span className={this.props.className}>
                {this.props.label && <FieldLabel label={this.props.label} />}
                <FormGroup bsSize="small">
                    <Checkbox style={this.style()} onChange={this.props.onChange} checked={this.props.value}>{this.props.checkText}</Checkbox>
                </FormGroup>
            </span>
        );
    }
}

export default CheckBoxField;