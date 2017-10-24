import './MonsterList.css';

import { Col, Grid, Label, Row } from 'react-bootstrap';
import React, { Component } from 'react';

import Monster from './Monster';
import MonsterData from './data/MonsterData';
import MonsterListData from './data/MonsterListData';
import MonsterMenuButton from "./monsterbuttons/MonsterMenuButton";
import StorageService from './services/StorageService';
import ToMonsterPageButton from "./monsterbuttons/ToMonsterPageButton";

class MonsterList extends Component {
    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.handleMonsterRightClick = this.handleMonsterRightClick.bind(this);
        this.buildColumn = this.buildColumn.bind(this);
        this.buildRows = this.buildRows.bind(this);
    }

    toggle() {
        return this.props.onToggle(this.props.list);
    }

    handleMonsterRightClick(monster: MonsterData, monsterEl: HTMLElement) {
        this.props.onMonsterRightClick(monster, monsterEl, this.props.list);
    }

    buildColumn(monster: MonsterData) {
        if (!monster) return false;
        return (
            <Col className="Monster-list-column" xs={12} key={monster.storageId}>
                <Monster
                    monster={monster}
                    onMonsterHpChange={this.props.onMonsterHpChange}
                    onRightClick={this.handleMonsterRightClick}
                />
            </Col>
        );
    }

    buildRows() {
        const monsters = this.props.list.monsters;
        if (!monsters) {
            return <span />;
        }
        const rows = monsters.map((monster: MonsterData, index: number) => {
            return <Row key={monsters[index].storageId}>{this.buildColumn(monsters[index])}</Row>;
        });
        return rows;
    }

    render() {
        const collapsed = this.props.list.collapsed;
        const numberOfMonsters = this.props.list.monsters ? this.props.list.monsters.length : 0;
        const icon = collapsed ? "glyphicon-chevron-right" : "glyphicon-chevron-down";
        const title = collapsed ? "Expand" : "Collapse";
        const grid = collapsed ? <span /> : <Grid>{this.buildRows()}</Grid>;
        return (
            <div>
                <div>
                    <div style={{ display: "inline-block" }}>
                        <ToMonsterPageButton monsterId={this.props.list.monsterId} name={this.props.list.name} />
                    </div>
                    <div className="Monster-list-header" title={title} onClick={this.toggle}>
                        <span>{this.props.list.name} (x{numberOfMonsters}):</span>
                        <span className="Monster-list-header-collapsible">
                            <MonsterMenuButton icon={icon} onClick={() => { }} />
                        </span>
                    </div>
                </div>
                {grid}
            </div>
        );
    }
}

export default MonsterList;