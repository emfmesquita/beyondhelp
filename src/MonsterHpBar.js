import React, { Component } from 'react';
import { Button, FormControl, FormGroup, InputGroup, Overlay, OverlayTrigger, Popover, Tooltip } from 'react-bootstrap';
import _ from 'lodash';
import $ from "jquery"
import './MonsterHpBar.css';
import MonsterData from './data/MonsterData';
import StorageService from './services/StorageService';
import MonsterMenuButton from "./monsterbuttons/MonsterMenuButton";

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
            hpFieldMode: false,
            mouseIn: true,
            hpChangeFieldValue: "",
            popoverVisible: false,
            popoverInitHp: 0
        };

        this.title = "Scroll or Click to Change";

        this.progressBarLabel = this.progressBarLabel.bind(this);
        this.calcHpRatio = this.calcHpRatio.bind(this);
        this.validateHpChangeField = this.validateHpChangeField.bind(this);

        // event handlers
        this.click = this.click.bind(this);
        this.doChangeHp = this.doChangeHp.bind(this);
        this.killPopover = this.killPopover.bind(this);
        this.mouseEnter = this.mouseEnter.bind(this);
        this.mouseLeave = this.mouseLeave.bind(this);
        this.cancelClick = this.cancelClick.bind(this);
        this.okClick = this.okClick.bind(this);
        this.changeHpFieldValue = this.changeHpFieldValue.bind(this);

        // render helpers
        this.renderProgressBar = this.renderProgressBar.bind(this);
        this.renderHpChangeField = this.renderHpChangeField.bind(this);
        this.renderWithPopover = this.renderWithPopover.bind(this);
        this.renderWithTooltip = this.renderWithTooltip.bind(this);
    }

    progressBarLabel() {
        return `#${this.monster.number} ${this.state.currentHp} / ${this.monster.hp}`;
    }

    calcHpRatio() {
        return (this.state.currentHp / this.monster.hp) * 100 + "%";
    }

    validateHpChangeField() {
        return isNaN(this.state.hpChangeFieldValue) ? "error" : "success";
    }

    //#region event handlers
    /**
     * onClick - Turn on hp field mode
     */
    click() {
        if (!this.state.hpFieldMode) {
            this.setState({ hpFieldMode: true, hpChangeFieldValue: this.state.currentHp });
        }
    }

    /**
     * onWheel - change hp if not on hp field mode
     */
    doChangeHp(e: WheelEvent) {
        if (this.state.hpFieldMode) {
            return;
        }
        e.preventDefault();
        e.stopPropagation();
        const delta = e.deltaY;
        this.setState((prevState) => {
            return changeHp(prevState, this.monster.hp, "1", delta > 0, this.props.onMonsterDead);
        }, () => {
            hpChanged(this.monster, this.state.currentHp);
        });
    }

    /**
     * onMouseEnter - reshow popover if fading
     */
    mouseEnter() {
        clearTimeout(this.popoverFadeTimeout);
        this.setState({ mouseIn: true });
    }

    /**
     * onMouseLeave - fade popover
     */
    mouseLeave() {
        this.setState({ mouseIn: false });
        if (!this.state.hpFieldMode) {
            this.popoverFadeTimeout = setTimeout(this.killPopover, popoverTimeout);
        }
    }

    /**
     * onHide - changes the state to destroy popover
     */
    killPopover() {
        this.setState({ popoverVisible: false });
    }

    /**
     * onChange of hp field value
     */
    changeHpFieldValue(e) {
        this.setState({ hpChangeFieldValue: e.target.value });
    }

    /**
     * onClick of cancel button of hp field mode
     */
    cancelClick() {
        this.setState({ hpFieldMode: false });
    }

    /**
     * onClick of ok button of hp field mode
     */
    okClick() {
        if(this.validateHpChangeField() === "error") return;
        this.setState({ hpFieldMode: false });
    }
    //#endregion 

    //#region render helpers
    renderProgressBar() {
        return (
            <div className="Monster-hp-bar" onWheel={this.doChangeHp} onClick={this.click} onMouseEnter={this.mouseEnter} onMouseLeave={this.mouseLeave}>
                <div className="progress" ref={(el) => { this.progressBarDiv = el; }}>
                    <div className="progress-bar progress-bar-danger" role="progressbar" style={{ width: this.calcHpRatio() }}>
                        <div className="Monster-hp-bar-text">{this.progressBarLabel()}</div>
                    </div>
                </div>
            </div>
        );
    }

    renderHpChangeField() {
        return (
            <div className="Monster-hp-bar">
                <FormGroup validationState={this.validateHpChangeField()}>
                    <InputGroup bsSize="small">
                        <InputGroup.Addon>
                            <MonsterMenuButton icon="glyphicon-remove" onClick={this.cancelClick} title="Cancel" />
                        </InputGroup.Addon>
                        <FormControl type="text" value={this.state.hpChangeFieldValue} onChange={this.changeHpFieldValue} />
                        <InputGroup.Addon>
                            <MonsterMenuButton icon="glyphicon-ok" onClick={this.okClick} title="Change Hp" />
                        </InputGroup.Addon>
                    </InputGroup>
                </FormGroup>
            </div>
        );
    }

    renderWithPopover(progressBar: JSX.Element) {
        const hpChange = this.state.currentHp - this.state.popoverInitHp;
        const colorClass = hpChange > 0 ? "Monster-hp-pop-heal" : (hpChange < 0 ? "Monster-hp-pop-damage" : "");

        const overlayProps = {
            target: () => this.progressBarDiv,
            show: this.state.popoverVisible,
            rootClose: true,
            onHide: this.killPopover,
            placement: "top"
        }

        return (
            <div>
                {progressBar}
                <Overlay {...overlayProps}>
                    <Popover id={`popover-${this.monster.storageId}`} className={this.state.mouseIn ? "Monster-hp-pop-in" : "Monster-hp-pop-fade"}>
                        <span className={`Monster-hp-pop ${colorClass}`}>
                            {hpChange > 0 ? `+${hpChange}` : `${hpChange}`}
                        </span>
                    </Popover>
                </Overlay>
            </div>
        );
    }

    renderWithTooltip(progressBar: JSX.Element) {
        const tooltip = <Tooltip id={`tooltip-${this.monster.storageId}`}>{this.title}</Tooltip>;
        return <OverlayTrigger placement="top" overlay={tooltip} delay={200}>{progressBar}</OverlayTrigger>;
    }
    //#endregion

    render() {
        if (this.state.hpFieldMode) {
            return this.renderHpChangeField();
        }
        if (this.state.popoverVisible) {
            return this.renderWithPopover(this.renderProgressBar());
        }
        return this.renderWithTooltip(this.renderProgressBar());
    }
}

export default MonsterHpBar;