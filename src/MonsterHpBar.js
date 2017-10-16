import React, { Component } from 'react';
import { Overlay, OverlayTrigger, Popover, Tooltip } from 'react-bootstrap';
import _ from 'lodash';
import $ from "jquery"
import './MonsterHpBar.css';
import MonsterData from './data/MonsterData';
import StorageService from './services/StorageService';

const popoverTimeout = 2000;

/**
 * Generates a new state with updated hp.
 */
const changeHp = function (prevState, maxHp: number, hpDiff: string, isDamage: boolean, onMonsterDead: Function) {
    let numberDiff = hpDiff === "" ? 1 : Number(hpDiff);
    numberDiff = isDamage ? -1 * numberDiff : numberDiff;

    let newCurrentHp = prevState.currentHp + numberDiff;
    newCurrentHp = newCurrentHp < 0 ? 0 : newCurrentHp;
    newCurrentHp = newCurrentHp > maxHp ? maxHp : newCurrentHp;

    onMonsterDead(newCurrentHp === 0);

    const popoverInitHp = prevState.popoverVisible ? prevState.popoverInitHp : prevState.currentHp;

    return { currentHp: newCurrentHp, popoverInitHp, popoverVisible: true };
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
        this.state = {
            currentHp: this.monster.currentHp,
            mouseIn: true,
            popoverVisible: false,
            popoverInitHp: 0
        };

        this.title = "Scroll to Change or Click";

        this.progressBarLabel = this.progressBarLabel.bind(this);
        this.calcHpRatio = this.calcHpRatio.bind(this);
        this.doChangeHp = this.doChangeHp.bind(this);
        this.killPopover = this.killPopover.bind(this);
        this.mouseEnter = this.mouseEnter.bind(this);
        this.mouseLeave = this.mouseLeave.bind(this);
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
        this.setState((prevState) => {
            return changeHp(prevState, this.monster.hp, "1", delta > 0, this.props.onMonsterDead);
        }, () => {
            hpChanged(this.monster, this.state.currentHp);
        });
    }

    mouseEnter() {
        this.setState({ mouseIn: true });
    }

    mouseLeave() {
        this.setState({ mouseIn: false });
        this.popoverFadeTimeout = setTimeout(this.killPopover, popoverTimeout)
    }

    killPopover() {
        this.setState({ popoverVisible: false });
        if(this.popoverFadeTimeout){
            clearTimeout(this.popoverFadeTimeout);
        }
    }

    render() {
        const base = (
            <div className="Monster-hp-bar" onWheel={this.doChangeHp} onMouseEnter={this.mouseEnter} onMouseLeave={this.mouseLeave}>
                <div className="progress" ref={(el) => { this.progressBarDiv = el; }}>
                    <div className="progress-bar progress-bar-danger" role="progressbar" style={{ width: this.calcHpRatio() }}>
                        <div className="Monster-hp-bar-text">{this.progressBarLabel()}</div>
                    </div>
                </div>
            </div>
        );

        let result;
        if (this.state.popoverVisible) {
            const hpChange = this.state.currentHp - this.state.popoverInitHp;
            let cssClass = "";
            if (hpChange > 0) {
                cssClass = "Monster-hp-pop-heal";
            } else if (hpChange < 0) {
                cssClass = "Monster-hp-pop-damage";
            }

            const overlayProps = {
                target: () => this.progressBarDiv,
                show: this.state.popoverVisible,
                rootClose: true,
                onHide: this.killPopover,
                placement: "top"
            }

            result = (
                <div>
                    {base}
                    <Overlay {...overlayProps}>
                        <Popover id={`popover-${this.monster.storageId}`} className={this.state.mouseIn ? "Monster-hp-pop-in" : "Monster-hp-pop-fade"}>
                            <span className={`Monster-hp-pop ${cssClass}`}>
                                {hpChange > 0 ? `+${hpChange}` : `${hpChange}`}
                            </span>
                        </Popover>
                    </Overlay>
                </div>
            );
        } else {
            const tooltip = <Tooltip id={`tooltip-${this.monster.storageId}`}>{this.title}</Tooltip>;
            result = <OverlayTrigger placement="top" overlay={tooltip} delay={200}>{base}</OverlayTrigger>;
        }

        return result;
    }
}

export default MonsterHpBar;