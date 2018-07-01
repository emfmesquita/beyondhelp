import "./BhModal.scss";

import React, { Component } from 'react';

import { Modal } from 'react-bootstrap';

class BhModal extends Component {
    renderFooter = () => {
        return this.props.footer ? <Modal.Footer>{this.props.footer}</Modal.Footer> : null;
    }

    renderHeader = () => {
        if (!this.props.title) return null;
        return (
            <Modal.Header closeButton>
                <Modal.Title>{this.props.title}</Modal.Title>
            </Modal.Header>
        );
    }

    render() {
        return (
            <Modal className="BH-modal" show={this.props.show} onHide={this.props.onHide}>
                {this.renderHeader()}
                <Modal.Body className={this.props.addPadding && "BH-modal-padding"}>{this.props.body}</Modal.Body>
                {this.renderFooter()}
            </Modal>
        );
    }
}

export default BhModal;