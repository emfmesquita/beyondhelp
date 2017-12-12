import React, { Component } from 'react';

import MonsterContentData from "./MonsterContentData";
import MonsterStorageService from '../../services/storage/MonsterStorageService';
import NotificationService from "../../services/NotificationService";

class AddMonsterButton extends Component {
    constructor(props) {
        super(props);
        this.addMonster = this.addMonster.bind(this);
        this.buildLabel = this.buildLabel.bind(this);
    }

    addMonster() {
        // creates a new monster on storage and send a message to the background page to create a notification
        MonsterStorageService.createMonster(this.props.monsterdata.id, this.props.monsterdata.name, this.props.monsterdata.hp)
            .then(monster => NotificationService.notifyNewMonster(this.props.monsterdata.name, monster))
            .catch(e => { throw e; });
    }

    buildLabel() {
        return `${this.props.monsterdata.hp}hp`;
    }

    render() {
        return (
            <a href="javascript:void(0)" className="view-rules button-alt spell-button-alt BH-Monster-button" onClick={this.addMonster}>
                <span>{this.buildLabel()}</span>
            </a>
        );
    }
}

export default AddMonsterButton;