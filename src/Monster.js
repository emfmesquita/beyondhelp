import './Monster.css';

import React, { Component } from 'react';

import MonsterHpBar from "./MonsterHpBar";
import MenuButton from "./buttons/MenuButton";
import { Row } from 'react-bootstrap';

class Monster extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showOptionsModal: false
        };
    }

    buildClassName = () => {
        return "Monster well" + (this.props.monster.currentHp === 0 ? " Monster-dead" : "");
    }

    handleClick = (e: MouseEvent) => {
        if (e.button !== 2) return;
        this.handleOptionsClick();
    }

    handleOptionsClick = () => {
        this.props.onRightClick(this.props.monster, this.element);
    }

    render() {
        return (
            <div className={this.buildClassName()} onMouseDown={this.handleClick} ref={(el) => this.element = el}>
                <Row>
                    <MonsterHpBar
                        monster={this.props.monster}
                        list={this.props.list}
                        encounter={this.props.encounter}
                        onMonsterHpChange={this.props.onMonsterHpChange}
                    />
                    <span className="Monster-config-button">
                        <MenuButton hidden={false} icon="glyphicon-cog" onClick={this.handleOptionsClick} title="Monster Options" />
                    </span>
                </Row>
            </div>
        );
    }
}

export default Monster;