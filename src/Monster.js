import './Monster.css';

import React, { Component } from 'react';

import $ from "jquery";
import MonsterHpBar from "./MonsterHpBar";
import MonsterMenuButton from "./monsterbuttons/MonsterMenuButton";
import { Row } from 'react-bootstrap';

class Monster extends Component {
    constructor(props) {
        super(props);
        this.removeMonster = this.removeMonster.bind(this);
    }

    removeMonster() {
        $(this.element).fadeOut(400, () => this.props.onRemoveMonster(this.props.monster));
    }

    render() {
        return (
            <div className={"Monster well" + (this.props.monster.currentHp === 0 ? " Monster-dead" : "")} ref={(element) => { this.element = element; }}>
                <Row>
                    <MonsterHpBar monster={this.props.monster} onMonsterHpChange={this.props.onMonsterHpChange}/>
                    <div className="Monster-delete-button">
                        <MonsterMenuButton hidden={false} icon="glyphicon-trash" onClick={this.removeMonster} title="Delete Monster" />
                    </div>
                </Row>
            </div>
        );
    }
}

export default Monster;