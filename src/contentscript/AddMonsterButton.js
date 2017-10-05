import React, { Component } from 'react';
import MonsterData from '../data/MonsterData';

const buttonStyle = {
    display: "inline-block",
    marginRight: "20px",
    marginBottom: "20px",
    width: "200px",
    paddingTop: "8px"
}

class AddMonsterButton extends Component {
    constructor(props) {
        super(props);
        this.addMonster = this.addMonster.bind(this);
        this.buildLabel = this.buildLabel.bind(this);
    }

    addMonster() {
        const toSave = {};
        const storageId = `bh-monster-${new Date().getTime()}`;
        const data = this.props.monsterdata;
        const monsterData = new MonsterData(storageId, data.id, data.name, data.hp);
        toSave[storageId] = monsterData;
        chrome.storage.sync.set(toSave, () => {
            if (chrome.runtime.lastError) {
                throw chrome.runtime.lastError;
            }
            chrome.runtime.sendMessage({
                notificationid: storageId,
                notification: {
                    type: "basic",
                    iconUrl: "icon-128.png",
                    title: "Beyond Help",
                    message: `${monsterData.name} added with ${monsterData.hp}HP`
                }
            });
        });
    }

    buildLabel() {
        return `Add with ${this.props.monsterdata.hp}hp`
    }

    render() {
        return <a className="button button-monsters" style={buttonStyle} href="javascript:void(0);" onClick={this.addMonster}>{this.buildLabel()}</a>;
    }
}

export default AddMonsterButton;