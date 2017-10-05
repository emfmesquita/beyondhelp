import React, { Component } from 'react';
import Monster from './Monster';
import './MonsterList.css';

class MonsterList extends Component {
    constructor(props) {
        super(props);
        this.buildList = this.buildList.bind(this);
    }

    buildList(){
        return this.props.monsters.map((monster) => {
            return <li key={monster.storageId}><Monster monster={monster} onRemoveMonster={this.props.onRemoveMonster}/></li>;
        });
    }

    render() {
        return <ul>{this.buildList()}</ul>;
    }
}

export default MonsterList;