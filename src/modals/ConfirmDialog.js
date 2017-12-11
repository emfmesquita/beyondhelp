import { Button, Modal } from 'react-bootstrap';
import React, { Component } from 'react';

class ConfirmDialog extends Component {
    render() {
        return (
            <Modal show={this.props.show} onHide={this.props.onCancel}>
                <Modal.Body>{this.props.message}</Modal.Body>
                <Modal.Footer>
                    <Button bsSize="small" bsStyle={this.props.confirmButtonStyle} onClick={this.props.onConfirm}>{this.props.confirmLabel || "Confirm"}</Button>
                    <Button bsSize="small" onClick={this.props.onCancel}>{this.props.cancelLabel || "Cancel"}</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default ConfirmDialog;