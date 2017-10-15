import React, { Component } from 'react';
import _ from 'lodash';
import $ from "jquery"
import './MonsterHpBar.css';
import MonsterData from './data/MonsterData';
import StorageService from './services/StorageService';
import MonsterHpPop from "./MonsterHpPop";

/**
 * Generates a new state with updated hp.
 */
const changeHp = function (currentHp: number, maxHp: number, hpDiff: string, isDamage: boolean, onMonsterDead: Function) {
    let numberDiff = hpDiff === "" ? 1 : Number(hpDiff);
    numberDiff = isDamage ? -1 * numberDiff : numberDiff;

    let newCurrentHp = currentHp + numberDiff;
    newCurrentHp = newCurrentHp < 0 ? 0 : newCurrentHp;
    newCurrentHp = newCurrentHp > maxHp ? maxHp : newCurrentHp;

    onMonsterDead(newCurrentHp === 0);

    return { currentHp: newCurrentHp };
}

/**
 * Handler called after hp changes, updates the monster on storage.
 */
const hpChanged = _.throttle((monster: MonsterData, newHp: number) => {
    monster.currentHp = newHp;
    StorageService.updateData(monster).catch((e) => { throw new Error(e); });
}, 500);

class MonsterHpBar extends Component {
    constructor(props) {
        super(props);
        this.monster = this.props.monster;
        this.outerDivId = `bh-hp-bar-${this.monster.storageId}`;
        this.state = {
            currentHp: this.monster.currentHp
        };

        this.popover = new MonsterHpPop(this.outerDivId);

        this.progressBarLabel = this.progressBarLabel.bind(this);
        this.calcHpRatio = this.calcHpRatio.bind(this);
        this.doChangeHp = this.doChangeHp.bind(this);
        this.hidePopover = this.hidePopover.bind(this);
    }

    progressBarLabel() {
        return `#${this.monster.number} ${this.state.currentHp} / ${this.monster.hp}`;
    }

    calcHpRatio() {
        return (this.state.currentHp / this.monster.hp) * 100 + "%";
    }

    doChangeHp(e: WheelEvent) {
        e.preventDefault();
        e.stopPropagation();
        const delta = e.deltaY;
        let oldHp = 0;
        this.setState((prevState) => {
            oldHp = prevState.currentHp;
            return changeHp(prevState.currentHp, this.monster.hp, "1", delta > 0, this.props.onMonsterDead);
        }, () => {
            this.popover.update(oldHp, this.state.currentHp);
            hpChanged(this.monster, this.state.currentHp);
        });
    }

    hidePopover() {
        this.popover.hide();
    }

    render() {
        return (
            <div id={this.outerDivId} className="Monster-hp-bar" onWheel={this.doChangeHp} onMouseLeave={this.hidePopover} /*title="Scroll to Change or Click"*/>
                <div className="progress">
                    <div className="progress-bar progress-bar-danger" role="progressbar" style={{ width: this.calcHpRatio() }}>
                        <div className="Monster-hp-bar-text">{this.progressBarLabel()}</div>
                    </div>
                </div>
            </div>
        );
    }
}

export default MonsterHpBar;