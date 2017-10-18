import React, { Component } from 'react';

import LinkService from "../services/LinkService";
import MonsterMenuButton from './MonsterMenuButton';

class ToMonsterPageButton extends Component {
    constructor(props) {
        super(props);
        this.handler = LinkService.handler(`https://www.dndbeyond.com/monsters/${this.props.monsterId}`);
    }

    render() {
        return <MonsterMenuButton hidden={!this.props.monsterId} icon="glyphicon-list-alt" title={`To Details Page of ${this.props.name}`} onClick={this.handler} />;
    }
}

export default ToMonsterPageButton;