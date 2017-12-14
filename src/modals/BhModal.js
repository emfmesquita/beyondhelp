import "./BhModal.scss";

import React, { Component } from 'react';

import { Modal } from 'react-bootstrap';

class BhModal extends Component {
    renderFooter = () => {
        return this.props.footer ? <Modal.Footer>{this.props.footer}</Modal.Footer> : null;
    }

    render() {
        return (
            <Modal className="BH-modal" show={this.props.show} onHide={this.props.onHide}>
                <Modal.Header closeButton>
                    <Modal.Title><h4>{this.props.title}</h4></Modal.Title>
                </Modal.Header>
                <Modal.Body className={this.props.addPadding && "BH-modal-padding"}>{this.props.body}</Modal.Body>
                {this.renderFooter()}
            </Modal>
        );
    }
}

export default BhModal;