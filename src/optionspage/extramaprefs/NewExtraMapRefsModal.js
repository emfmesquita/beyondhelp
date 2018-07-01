import { Button, FormControl, FormGroup, Modal } from 'react-bootstrap';
import React, { Component } from 'react';

import BhModal from '../../modals/BhModal';
import FieldService from '../../services/FieldService';
import TextField from '../../forms/TextField';

class NewExtraMapRefsModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: ""
        };
    }

    validate = () => {
        if (!this.state.value) return "error";
        const valueSize = this.state.value.trim().length;
        return valueSize > 0 ? "success" : "error";
    }

    save = (e: MouseEvent) => {
        if (this.validate() === "success") {
            this.props.onSave(this.state.value.trim());
        }
    }

    renderBody = () => {
        return (
            <TextField
                label="Bundle Name"
                value={this.state.value}
                valuePropName="value"
                maxLength="40"
                validationState={this.validate()}
                onEnter={this.save}
                container={this}
            />
        );
    }

    renderFooter = () => {
        return (
            <div>
                <Button bsSize="small" bsStyle="primary" onClick={this.save} disabled={this.validate() !== "success"}>Save</Button>
                <Button bsSize="small" onClick={this.props.onHide}>Cancel</Button>
            </div>
        );
    }

    render() {
        return <BhModal addPadding show={this.props.show} onHide={this.props.onHide} title="New Extra Map References Bundle" body={this.renderBody()} footer={this.renderFooter()} />;
    }
}

export default NewExtraMapRefsModal;