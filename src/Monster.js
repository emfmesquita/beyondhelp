import React, { Component } from 'react';
import { Button, Col, FormControl, FormGroup, InputGroup, Row } from 'react-bootstrap';
import _ from 'lodash';
import './Monster.css';
import MonsterInfoModal from './MonsterInfoModal';
import MonsterData from './data/MonsterData';
import StorageService from './services/StorageService';
import MonsterMenuButton from "./monsterbuttons/MonsterMenuButton";
import ToMonsterPageButton from "./monsterbuttons/ToMonsterPageButton"


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
    StorageService.updateMonster(monster).catch((e) => { throw new Error(e); });
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
        this.calcHpRatio = this.calcHpRatio.bind(this);
        this.updateDamage = this.updateDamage.bind(this);
        this.updateHeal = this.updateHeal.bind(this);
        this.doDamage = this.doDamage.bind(this);
        this.doHeal = this.doHeal.bind(this);
        this.removeMonster = this.removeMonster.bind(this);
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

    removeMonster() {
        this.props.onRemoveMonster(this.monster.storageId);
    }

    render() {
        return (
            <div className={"well" + (this.state.dead ? " Monster-dead" : "")}>
                <button className="close pull-right Monster-remove-button" onClick={this.removeMonster} title="Remove Monster">
                    <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
                </button>
                <MonsterMenuButton hidden={!!this.monster.monsterId} icon="glyphicon-stats" />
                <ToMonsterPageButton monsterId={this.monster.monsterId} />
                <h5 className={"text-center Monster-title" + (this.state.dead ? " Monster-dead" : "")}>
                    {this.monster.name} ({this.monster.number})
                </h5>
                <Row>
                    <Col xs={12}>
                        <div className="progress">
                            <div className="progress-bar progress-bar-danger" role="progressbar" style={{ width: this.calcHpRatio() }}>
                                <div className="Monster-hp-bar-text">{this.state.currentHp} / {this.monster.hp}</div>
                            </div>
                        </div>
                    </Col>
                </Row>
                <Row>
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
                </Row>
            </div>
        );
    }
}

export default Monster;