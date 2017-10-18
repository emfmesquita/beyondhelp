import React, { Component } from 'react';
import MonsterMenuButton from './MonsterMenuButton';
import LinkHandler from "../services/LinkHandler";

class ToMonsterPageButton extends Component {
    constructor(props) {
        super(props);
        this.handler = new LinkHandler(`https://www.dndbeyond.com/monsters/${this.props.monsterId}`);
    }

    render() {
        return <MonsterMenuButton hidden={!this.props.monsterId} icon="glyphicon-list-alt" title={`To Details Page of ${this.props.name}`} onClick={this.handler.click} />;
    }
}

export default ToMonsterPageButton;