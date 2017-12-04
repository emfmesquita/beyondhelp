import { Button, FormControl, FormGroup, Modal } from 'react-bootstrap';
import React, { Component } from 'react';

import TextFieldService from "../services/TextFieldService";

class NewEncounterModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: ""
        };
        this.validate = this.validate.bind(this);
        this.save = this.save.bind(this);
    }

    validate() {
        if (!this.state.value) return "error";
        const valueSize = this.state.value.trim().length;
        return valueSize > 0 && valueSize < 40 ? "success" : "error";
    }

    save(e: MouseEvent) {
        if (this.validate() === "success") {
            this.props.onSave(this.state.value.trim());
        }
    }

    render() {
        return (
            <Modal show={this.props.show} onHide={this.props.onHide}>
                <Modal.Header closeButton>
                    <Modal.Title>New Encounter</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FormGroup bsSize="small" validationState={this.validate()}>
                        <FormControl
                            type="text"
                            placeholder="Encounter Name"
                            value={this.state.value}
                            onChange={TextFieldService.onChangeMethod("value", this)}
                            onKeyDown={TextFieldService.onKeyDownMethod(this.save, this)}
                        />
                    </FormGroup>
                </Modal.Body>
                <Modal.Footer>
                    <Button bsSize="small" bsStyle="primary" onClick={this.save} disabled={this.validate() !== "success"}>Save</Button>
                    <Button bsSize="small" onClick={this.props.onHide}>Cancel</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default NewEncounterModal;