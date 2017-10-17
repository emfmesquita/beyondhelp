import React, { Component } from 'react';
import { Label, Grid, Row, Col } from 'react-bootstrap';
import _ from 'lodash';
import Monster from './Monster';
import MonsterData from './data/MonsterData';
import MonsterMetadata from './data/MonsterMetadata';
import ToMonsterPageButton from "./monsterbuttons/ToMonsterPageButton";
import MonsterMenuButton from "./monsterbuttons/MonsterMenuButton";
import StorageService from './services/StorageService';
import './MonsterList.css';

/**
 * Handler called after toggle, updates the metadata on storage.
 */
const saveToggle = _.throttle((metadata: MonsterMetadata, collapsedState: boolean) => {
    metadata.collapsed = collapsedState;
    const toSave = MonsterMetadata.savableClone(metadata);
    StorageService.updateData(toSave).catch((e) => { throw new Error(e); });
}, 500);

class MonsterList extends Component {
    constructor(props) {
        super(props);
        this.state = { collapsed: this.props.metadata.collapsed };
        this.monsters = this.props.metadata.monsters;
        this.buildColumn = this.buildColumn.bind(this);
        this.buildRows = this.buildRows.bind(this);
        this.toggle = this.toggle.bind(this);
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
        const rows = this.monsters.map((monster: MonsterData, index: number) => {
            const even = index % 2 === 0;
            if (!even) return false;
            return (
                <Row key={this.monsters[index].storageId}>
                    {this.buildColumn(this.monsters[index])}
                    {this.buildColumn(index < this.monsters.length - 1 ? this.monsters[index + 1] : null)}
                </Row>
            );
        });
        return rows;
    }

    toggle() {
        this.setState((prevState) => {
            return { collapsed: !prevState.collapsed };
        }, () => {
            saveToggle(this.props.metadata, this.state.collapsed);
        });
    }

    render() {
        const icon = this.state.collapsed ? "glyphicon-chevron-right" : "glyphicon-chevron-down";
        const title = this.state.collapsed ? "Expand" : "Collapse";
        const grid = this.state.collapsed ? <span /> : <Grid>{this.buildRows()}</Grid>;
        return (
            <div>
                <div>
                    <div style={{ display: "inline-block" }}>
                        <ToMonsterPageButton monsterId={this.props.metadata.monsterId} name={this.props.metadata.name} />
                    </div>
                    <div className="Monster-list-header" title={title} onClick={this.toggle}>
                        <span>{this.props.metadata.name} (x{this.monsters.length}):</span>
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