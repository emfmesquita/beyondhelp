import './MonsterList.scss';

import { Col, Grid, Label, Row } from 'react-bootstrap';
import React, { Component } from 'react';

import ColorService from './services/ColorService';
import Monster from './Monster';
import MonsterData from './data/MonsterData';
import MonsterListData from './data/MonsterListData';
import MonsterMenuButton from "./monsterbuttons/MonsterMenuButton";

class MonsterList extends Component {
    headerTextColor = () => {
        return ColorService.listHeaderTextColor(this.props.list.headerColor);
    }

    toggle = () => {
        return this.props.onToggle(this.props.list);
    }

    handleMonsterRightClick = (monster: MonsterData, monsterEl: HTMLElement) => {
        this.props.onMonsterRightClick(monster, monsterEl, this.props.list);
    }

    buildColumn = (monster: MonsterData) => {
        if (!monster) return false;
        return (
            <Col className="Monster-list-column" xs={12} key={monster.storageId}>
                <Monster
                    monster={monster}
                    list={this.props.list}
                    encounter={this.props.encounter}
                    onMonsterHpChange={this.props.onMonsterHpChange}
                    onRightClick={this.handleMonsterRightClick}
                />
            </Col>
        );
    }

    buildRows = () => {
        const monsters = this.props.list.monsters;
        if (!monsters) {
            return <span />;
        }
        const rows = monsters.map((monster: MonsterData, index: number) => {
            return <Row key={monsters[index].storageId}>{this.buildColumn(monsters[index])}</Row>;
        });
        return rows;
    }

    handleClick = (e: MouseEvent) => {
        if (e.button !== 2) return;
        this.handleOptionsClick();
    }

    handleOptionsClick = () => {
        this.props.onRightClick(this.props.list, this.element);
    }

    render() {
        const collapsed = this.props.list.collapsed;
        const numberOfMonsters = this.props.list.monsters ? this.props.list.monsters.length : 0;
        const icon = collapsed ? "glyphicon-chevron-right" : "glyphicon-chevron-down";
        const title = collapsed ? "Expand" : "Collapse";
        const grid = collapsed ? <span /> : <Grid>{this.buildRows()}</Grid>;
        return (
            <div ref={(el) => this.element = el}>
                <div className="Monster-list-header-container" onMouseDown={this.handleClick}>
                    <MonsterMenuButton icon="glyphicon-cog" title="List Options" onClick={this.handleOptionsClick} />
                    <div className="Monster-list-header" title={title} onClick={this.toggle} style={{ color: this.headerTextColor() }}>
                        <div className="Monster-list-header-text">{`(${numberOfMonsters}) ${this.props.list.name}`}</div>
                    </div>
                    <span className="Monster-list-header-collapsible" title={title} onClick={this.toggle}>
                        <MonsterMenuButton icon={icon} onClick={() => { }} />
                    </span>
                </div>
                {grid}
            </div>
        );
    }
}

export default MonsterList;