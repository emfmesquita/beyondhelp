import React, { Component } from 'react';
import { Row } from 'react-bootstrap';
import $ from "jquery";
import './Monster.css';
import MonsterMenuButton from "./monsterbuttons/MonsterMenuButton";
import MonsterHpBar from "./MonsterHpBar";

class Monster extends Component {
    constructor(props) {
        super(props);
        this.monster = this.props.monster;
        this.state = {
            dead: this.monster.currentHp === 0
        };
        this.handleMonsterDead = this.handleMonsterDead.bind(this);
        this.removeMonster = this.removeMonster.bind(this);
    }

    handleMonsterDead(dead: boolean) {
        this.setState({ dead });
    }

    removeMonster() {
        $(this.element).fadeOut(400, () => this.props.onRemoveMonster(this.monster));
    }

    render() {
        return (
            <div className={"Monster well" + (this.state.dead ? " Monster-dead" : "")} ref={(element) => { this.element = element; }}>
                <Row>
                    <MonsterHpBar monster={this.monster} onMonsterDead={this.handleMonsterDead} />
                    <div className="Monster-delete-button">
                        <MonsterMenuButton hidden={false} icon="glyphicon-trash" onClick={this.removeMonster} title="Delete Monster" />
                    </div>
                </Row>
            </div>
        );
    }
}

export default Monster;