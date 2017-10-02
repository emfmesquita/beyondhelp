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
            const key = monster.name + "_" + monster.number;
            return <li key={key}><Monster monster={monster} /></li>;
        });
    }

    render() {
        return <ul>{this.buildList()}</ul>;
    }
}

export default MonsterList;