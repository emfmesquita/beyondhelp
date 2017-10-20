import { Button, FormControl, FormGroup, Modal } from 'react-bootstrap';
import React, { Component } from 'react';

class NewEncounterModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: ""
        };
        this.validate = this.validate.bind(this);
        this.changeValue = this.changeValue.bind(this);
        this.saveClick = this.saveClick.bind(this);
        this.keyDown = this.keyDown.bind(this);
    }

    validate() {
        if(!this.state.value) return "error";
        const valueSize = this.state.value.trim().length;
        return valueSize > 0 && valueSize < 40 ? "success" : "error";
    }

    changeValue(e) {
        this.setState({ value: e.target.value });
    }

    saveClick(e: MouseEvent) {
        if (this.validate() === "success") {
            this.props.onSave(this.state.value.trim());
        }
    }

    keyDown(e: KeyboardEvent) {
        if (e.which === 13 || e.keyCode === 13) {
            this.saveClick();
            return;
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
                        <FormControl type="text" placeholder="Encounter Name" value={this.state.value} onChange={this.changeValue} onKeyDown={this.keyDown} />
                    </FormGroup>
                </Modal.Body>
                <Modal.Footer>
                    <Button bsSize="small" bsStyle="primary" onClick={this.saveClick} disabled={this.validate() !== "success"}>Save</Button>
                    <Button bsSize="small" onClick={this.props.onHide}>Close</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default NewEncounterModal;