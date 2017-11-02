import "./MonsterOptionsModal.scss";

import { Glyphicon, ListGroup, ListGroupItem, Modal } from 'react-bootstrap';
import React, { Component } from 'react';

import OptionLine from "./OptionLine";

class MonsterOptionsModal extends Component {
    constructor(props) {
        super(props);
        this.buildTitle = this.buildTitle.bind(this);
    }

    buildTitle() {
        const list = this.props.context.list;
        const mon = this.props.context.monster;
        if (!list || !mon) return "";
        if (mon.name) return mon.name;
        return `${list.name} #${mon.number}`;
    }

    render() {
        return (
            <Modal className="Monster-options" show={this.props.show} onHide={this.props.onHide}>
                <Modal.Header closeButton>
                    <Modal.Title>{this.buildTitle()}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ListGroup>
                        <OptionLine onClick={this.props.onKill} icon="thumbs-down">Kill (0HP)</OptionLine>
                        <OptionLine onClick={this.props.onFullHeal} icon="heart">Full Heal</OptionLine>
                        <OptionLine onClick={this.props.onDelete} icon="trash">Delete</OptionLine>
                    </ListGroup>
                </Modal.Body>
            </Modal>
        );
    }
}

export default MonsterOptionsModal;