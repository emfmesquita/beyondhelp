import React, { Component } from 'react';

class AddMonsterButton extends Component {
    constructor(props) {
        super(props);
        this.addMonster = this.addMonster.bind(this);
        this.buildLabel = this.buildLabel.bind(this);
    }

    addMonster() {
        const clonedData = JSON.parse(JSON.stringify(this.props.monsterdata));
        const toSave = {};
        const storageId = `bh-monster-${new Date().getTime()}`;
        toSave[storageId] = this.props.monsterdata;
        chrome.storage.sync.set(toSave, (error) => {
            if(error){
                return;
            }
            chrome.runtime.sendMessage({
                notificationid: storageId,
                notification: {
                    type: "basic",
                    iconUrl: "icon-128.png",
                    title: "Beyond Help",
                    message: `${clonedData.name} added with ${clonedData.hp}HP`
                }
            });
        });
    }

    buildLabel() {
        return `Add with ${this.props.monsterdata.hp}hp`
    }

    render() {
        return (
            <div className="more-info-footer-details-button" onClick={this.addMonster}>
                <a className="button button-monsters" href="javascript:void(0);">{this.buildLabel()}</a>
            </div>
        );
    }
}

export default AddMonsterButton;