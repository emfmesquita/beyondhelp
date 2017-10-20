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
        this.buildColumn = this.buildColumn.bind(this);
        this.buildRows = this.buildRows.bind(this);
        this.toggle = this.toggle.bind(this);
    }

    buildColumn(monster: MonsterData) {
        if (!monster) return false;
        return (
            <Col className="Monster-list-column" xs={6} key={monster.storageId}>
                <Monster monster={monster} onRemoveMonster={this.props.onRemoveMonster} onMonsterHpChange={this.props.onMonsterHpChange} />
            </Col>
        );
    }

    buildRows() {
        const monsters = this.props.list.monsters;
        if (!monsters) {
            return <span />;
        }
        const rows = monsters.map((monster: MonsterData, index: number) => {
            const even = index % 2 === 0;
            if (!even) return false;
            return (
                <Row key={monsters[index].storageId}>
                    {this.buildColumn(monsters[index])}
                    {this.buildColumn(index < monsters.length - 1 ? monsters[index + 1] : null)}
                </Row>
            );
        });
        return rows;
    }

    toggle() {
        return this.props.onToggle(this.props.list);
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