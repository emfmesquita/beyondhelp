import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import Monster from './Monster';
import MonsterData from './data/MonsterData';
import './MonsterList.css';
import ToMonsterPageButton from "./monsterbuttons/ToMonsterPageButton";

class MonsterList extends Component {
    constructor(props) {
        super(props);
        this.buildColumn = this.buildColumn.bind(this);
        this.buildRows = this.buildRows.bind(this);
    }

    buildColumn(monster: MonsterData) {
        if (!monster) return false;
        return (
            <Col className="Monster-list-column" xs={6} key={monster.storageId}>
                <Monster monster={monster} onRemoveMonster={this.props.onRemoveMonster} />
            </Col>
        );
    }

    buildRows() {
        const monsters = this.props.monsters;
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

    render() {
        return (
            <div>
                <div>
                    <div style={{ display: "inline-block" }}>
                        <ToMonsterPageButton monsterId={this.props.id} />
                    </div>
                    <div style={{ display: "inline-block" }} className="Monster-list-header">
                        <p>{this.props.name} (x{this.props.monsters.length}):</p>
                    </div>
                </div>
                <Grid>{this.buildRows()}</Grid>
            </div>
        );
    }
}

export default MonsterList;