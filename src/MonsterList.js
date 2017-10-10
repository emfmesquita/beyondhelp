import React, { Component } from 'react';
import Monster from './Monster';
import MonsterData from './data/MonsterData';
import './MonsterList.css';
import ToMonsterPageButton from "./monsterbuttons/ToMonsterPageButton";

class MonsterList extends Component {
    constructor(props) {
        super(props);
        this.buildList = this.buildList.bind(this);
    }

    buildList() {
        return this.props.monsters.map((monster: MonsterData, index: number) => {
            const last = (this.props.monsters.length - 1) === index;
            return (
                <li className={last && "Monster-list-last"} key={monster.storageId}>
                    <Monster monster={monster} onRemoveMonster={this.props.onRemoveMonster} />
                </li>
            );
        });
    }

    render() {
        return (
            <div>
                <div>
                    <div style={{display: "inline-block"}}>
                        <ToMonsterPageButton monsterId={this.props.id} />
                    </div>
                    <div style={{display: "inline-block"}} className="Monster-list-header">
                        <p>{this.props.name} (x{this.props.monsters.length}):</p>
                    </div>
                </div>
                <ul>{this.buildList()}</ul>
            </div>
        );
    }
}

export default MonsterList;