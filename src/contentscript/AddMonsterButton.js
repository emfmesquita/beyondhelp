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
        this.data = this.props.monsterdata;
        this.addMonster = this.addMonster.bind(this);
        this.buildLabel = this.buildLabel.bind(this);
    }

    addMonster() {
        StorageService.createMonster(this.data.id, this.data.name, this.data.hp)
            .then(monster => NotificationService.notifyNewMonster(this.data.name, monster))
            .catch(e => { throw e; });
    }

    buildLabel() {
        return `Add with ${this.data.hp}hp`;
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