import { FormControl, FormGroup } from 'react-bootstrap';
import React, { Component } from "react";

import FieldLabel from "./FieldLabel";
import FieldService from "../services/FieldService";

class TextField extends Component {
    render() {
        return (
            <div>
                <FieldLabel label={this.props.label} />
                <FormGroup bsSize="small" validationState={this.props.validationState}>
                    <FormControl
                        type="text"
                        style={{ height: "32px" }}
                        value={this.props.value}
                        onChange={FieldService.onChangeFunc(this.props.valuePropName, this.props.container)}
                        onKeyDown={FieldService.onEnterFunc(this.props.onEnter, this.props.container)}
                        maxLength={this.props.maxLength}
                    />
                </FormGroup>
            </div>
        );
    }
}

export default TextField;