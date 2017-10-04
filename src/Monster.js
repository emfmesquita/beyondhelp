import React, { Component } from 'react';
import { Button, Col, FormControl, FormGroup, InputGroup, Row } from 'react-bootstrap';
import './Monster.css';
import MonsterInfoModal from './MonsterInfoModal';

class Monster extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currenthp: props.monster.hp,
            damage: "",
            heal: "",
            dead: false
        };
        this.calcHpRatio = this.calcHpRatio.bind(this);
        this.updateDamage = this.updateDamage.bind(this);
        this.updateHeal = this.updateHeal.bind(this);
        this.doDamage = this.doDamage.bind(this);
        this.doHeal = this.doHeal.bind(this);
    }

    calcHpRatio() {
        return (this.state.currenthp / this.props.monster.hp) * 100 + "%";
    }

    updateDamage(e) {
        this.setState({ damage: e.target.value });
    }

    updateHeal(e) {
        this.setState({ heal: e.target.value });
    }

    doDamage() {
        this.setState((prevState, props)=> {
            if(isNaN(prevState.damage) && prevState.damage !== "") return prevState;
            const newState = {};
            const damage = prevState.damage === "" ? 1 : Number(prevState.damage);
            newState.currenthp = prevState.currenthp - damage;
            newState.currenthp = newState.currenthp < 0 ? 0 : newState.currenthp;
            if(newState.currenthp === 0){
                newState.dead = true;
            }
            return newState;
        });
    }

    doHeal() {
        this.setState((prevState, props)=> {
            if(isNaN(prevState.heal) && prevState.heal !== "") return prevState;
            const newState = {};
            const heal = prevState.heal === "" ? 1 : Number(prevState.heal);
            newState.currenthp = prevState.currenthp + heal;
            newState.currenthp = newState.currenthp > props.monster.hp ? props.monster.hp : newState.currenthp;
            if(newState.currenthp > 0){
                newState.dead = false;
            }
            return newState;
        });
    }

    render() {
        return (
            <div className={"well" + (this.state.dead ? " Monster-dead" : "")}>
                <a className={"pull-left monster-stats-button" + (this.props.monster.id ? "" : " hidden")} href="javascript:void(0)" onClick="mhp_stats.showMonsterStats(this);" role="button">
                    <span className="glyphicon glyphicon-stats" aria-hidden="true"></span>
                </a>
                <h5 className={"text-center Monster-title" + (this.state.dead ? " Monster-dead" : "")}>
                    {this.props.monster.name} ({this.props.monster.number})
                </h5>
                <Row>
                    <Col xs={12}>
                        <div className="progress">
                            <div className="progress-bar progress-bar-danger" role="progressbar" style={{ width: this.calcHpRatio() }}>
                                <div className="Monster-hp-bar-text">{this.state.currenthp} / {this.props.monster.hp}</div>
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
                                <FormControl placeholder="DMG" type="text" className="text-center" onChange={this.updateDamage}/>
                            </InputGroup>
                        </FormGroup>
                    </Col>
                    <Col xs={6} className="Monster-heal-column">
                        <FormGroup>
                            <InputGroup>
                                <FormControl placeholder="Heal" type="text" className="text-center" onChange={this.updateHeal}/>
                                <InputGroup.Button>
                                    <Button bsStyle="danger" className="Monster-hp-button" onClick={this.doHeal}>
                                        <span className="glyphicon glyphicon-arrow-up" aria-hidden="true"/>
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