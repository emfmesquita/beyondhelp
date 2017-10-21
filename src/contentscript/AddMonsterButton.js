import React, { Component } from 'react';

import MonsterContentData from "./MonsterContentData";
import NotificationService from "../services/NotificationService";
import StorageService from '../services/StorageService';

const buttonStyle = {
    display: "inline-block",
    marginRight: "10px",
    marginBottom: "20px",
    width: "auto",
    padding: "0 15px",
    borderColor: "#bc0f0f"
};

class AddMonsterButton extends Component {
    constructor(props) {
        super(props);
        this.addMonster = this.addMonster.bind(this);
        this.buildLabel = this.buildLabel.bind(this);
    }

    addMonster() {
        // creates a new monster on storage and send a message to the background page to create a notification
        StorageService.createMonster(this.props.monsterdata.id, this.props.monsterdata.name, this.props.monsterdata.hp)
            .then(monster => NotificationService.notifyNewMonster(this.props.monsterdata.name, monster))
            .catch(e => { throw e; });
    }

    buildLabel() {
        return `Add with ${this.props.monsterdata.hp}hp`;
    }

    render() {
        return (
            <a href="javascript:void(0)" className="view-rules button-alt spell-button-alt" style={buttonStyle} onClick={this.addMonster}>
                <span>{this.buildLabel()}</span>
            </a>
        );
    }
}

export default AddMonsterButton;