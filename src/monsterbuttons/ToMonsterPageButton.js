import React, { Component } from 'react';
import MonsterMenuButton from './MonsterMenuButton';
/* global chrome */

class ToMonsterPageButton extends Component {
    constructor(props) {
        super(props);
        this.click = this.click.bind(this);
    }

    click({ button }: MouseEvent) {
        if(button === 2) return;
        const newUrl = `https://www.dndbeyond.com/monsters/${this.props.monsterId}`;
        chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
            if(button === 0){
                if (tab.url === newUrl) return;
                chrome.tabs.update(tab.id, { url: newUrl });
            } else if (button === 1) {
                chrome.tabs.create({ url: newUrl, active: false, index: tab.index + 1 });
            }
        });
    }

    render() {
        return <MonsterMenuButton hidden={!this.props.monsterId} icon="glyphicon-list-alt" title="Monster Details Page" onClick={this.click} />
    }
}

export default ToMonsterPageButton;