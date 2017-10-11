import React, { Component } from 'react';
import { Button, Col, FormControl, FormGroup, InputGroup, Row } from 'react-bootstrap';
import _ from 'lodash';
import $ from "jquery"
import './Monster.css';
import MonsterData from './data/MonsterData';
import StorageService from './services/StorageService';
import MonsterMenuButton from "./monsterbuttons/MonsterMenuButton";


/**
 * Generates a new state with updated hp.
 */
const changeHp = function (currentHp: number, maxHp: number, hpDiff: string, isDamage: boolean) {
    let numberDiff = hpDiff === "" ? 1 : Number(hpDiff);
    numberDiff = isDamage ? -1 * numberDiff : numberDiff;

    let newCurrentHp = currentHp + numberDiff;
    newCurrentHp = newCurrentHp < 0 ? 0 : newCurrentHp;
    newCurrentHp = newCurrentHp > maxHp ? maxHp : newCurrentHp;

    return { currentHp: newCurrentHp, dead: newCurrentHp === 0 };
}

/**
 * Handler called after hp changes, updates the monster on storage.
 */
const hpChanged = _.throttle((monster: MonsterData, newHp: number) => {
    monster.currentHp = newHp;
    StorageService.updateData(monster).catch((e) => { throw new Error(e); });
}, 500);

class Monster extends Component {
    constructor(props) {
        super(props);
        this.monster = this.props.monster;
        this.state = {
            currentHp: this.monster.currentHp,
            damage: "",
            heal: "",
            dead: this.monster.currentHp === 0
        };
        this.progressBarLabel = this.progressBarLabel.bind(this);
        this.calcHpRatio = this.calcHpRatio.bind(this);
        this.updateDamage = this.updateDamage.bind(this);
        this.updateHeal = this.updateHeal.bind(this);
        this.doDamage = this.doDamage.bind(this);
        this.doHeal = this.doHeal.bind(this);
        this.doChangeHp = this.doChangeHp.bind(this);
        this.removeMonster = this.removeMonster.bind(this);
    }

    progressBarLabel() {
        return `#${this.monster.number} ${this.state.currentHp} / ${this.monster.hp}`;
    }

    calcHpRatio() {
        return (this.state.currentHp / this.monster.hp) * 100 + "%";
    }

    updateDamage(e: Event) {
        this.setState({ damage: e.target.value });
    }

    updateHeal(e: Event) {
        this.setState({ heal: e.target.value });
    }

    doDamage() {
        this.setState((prevState, props) => {
            if (isNaN(prevState.damage) && prevState.damage !== "") return prevState;
            return changeHp(prevState.currentHp, this.monster.hp, prevState.damage, true);
        }, (updatedState) => hpChanged(this.monster, this.state.currentHp));
    }

    doHeal() {
        this.setState((prevState) => {
            if (isNaN(prevState.heal) && prevState.heal !== "") return prevState;
            return changeHp(prevState.currentHp, this.monster.hp, prevState.heal, false);
        }, (updatedState) => hpChanged(this.monster, this.state.currentHp));
    }

    doChangeHp(e: WheelEvent) {
        e.preventDefault();
        e.stopPropagation();
        const delta = e.deltaY;
        this.setState((prevState) => {
            return changeHp(prevState.currentHp, this.monster.hp, "1", delta > 0);
        }, (updatedState) => hpChanged(this.monster, this.state.currentHp));
    }

    removeMonster() {
        $(this.element).fadeOut(400, () => this.props.onRemoveMonster(this.monster));
    }

    render() {
        return (
            <div className={"well" + (this.state.dead ? " Monster-dead" : "")} ref={(element) => { this.element = element; }}>
                <Row>
                    <div className="Monster-hp-bar" onWheel={this.doChangeHp} title="Scroll to Change or Click">
                        <div className="progress">
                            <div className="progress-bar progress-bar-danger" role="progressbar" style={{ width: this.calcHpRatio() }}>
                                <div className="Monster-hp-bar-text">{this.progressBarLabel()}</div>
                            </div>
                        </div>
                    </div>
                    <div className="Monster-delete-button">
                        <MonsterMenuButton hidden={false} icon="glyphicon-trash" onClick={this.removeMonster} title="Delete Monster" />
                    </div>
                </Row>
                {/* <Row>
                    <Col xs={6} className="Monster-damage-column">
                        <FormGroup>
                            <InputGroup>
                                <InputGroup.Button>
                                    <Button bsStyle="danger" className="Monster-hp-button" onClick={this.doDamage}>
                                        <span className="glyphicon glyphicon-arrow-down" aria-hidden="true" />
                                    </Button>
                                </InputGroup.Button>
                                <FormControl placeholder="DMG" type="text" className="text-center" onChange={this.updateDamage} />
                            </InputGroup>
                        </FormGroup>
                    </Col>
                    <Col xs={6} className="Monster-heal-column">
                        <FormGroup>
                            <InputGroup>
                                <FormControl placeholder="Heal" type="text" className="text-center" onChange={this.updateHeal} />
                                <InputGroup.Button>
                                    <Button bsStyle="danger" className="Monster-hp-button" onClick={this.doHeal}>
                                        <span className="glyphicon glyphicon-arrow-up" aria-hidden="true" />
                                    </Button>
                                </InputGroup.Button>
                            </InputGroup>
                        </FormGroup>
                    </Col>
                </Row> */}
            </div>
        );
    }
}

export default Monster;