import './MonsterHpBar.css';

import { Button, FormControl, FormGroup, InputGroup, Overlay, OverlayTrigger, Popover, Tooltip } from 'react-bootstrap';
import React, { Component } from 'react';

import $ from "jquery";
import MonsterData from './data/MonsterData';
import MonsterHpBarForm from "./MonsterHpBarForm";
import MonsterHpBarPop from "./MonsterHpBarPop";
import MonsterMenuButton from "./monsterbuttons/MonsterMenuButton";
import StorageService from './services/StorageService';

/**
 * Limits a HP value between zero and max HP.
 */
const validHp = function (maxHp: number, newHp: number) {
    const notNegativeHp = newHp < 0 ? 0 : newHp;
    return notNegativeHp > maxHp ? maxHp : notNegativeHp;
};

class MonsterHpBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hpFormMode: false,
            mouseIn: true,
            popoverVisible: false,
            popoverInitHp: 0
        };

        this.title = "Scroll or Click to Change HP";

        this.progressBarLabel = this.progressBarLabel.bind(this);
        this.calcHpRatio = this.calcHpRatio.bind(this);

        // event handlers
        this.click = this.click.bind(this);
        this.doChangeHp = this.doChangeHp.bind(this);
        this.killPopover = this.killPopover.bind(this);
        this.mouseEnter = this.mouseEnter.bind(this);
        this.mouseLeave = this.mouseLeave.bind(this);
        this.handleChangeHpFormValue = this.handleChangeHpFormValue.bind(this);
        this.handleChangeHpFormCancel = this.handleChangeHpFormCancel.bind(this);

        // render helpers
        this.renderProgressBar = this.renderProgressBar.bind(this);
        this.renderHpChangeForm = this.renderHpChangeForm.bind(this);
        this.renderWithPopover = this.renderWithPopover.bind(this);
        this.renderWithTooltip = this.renderWithTooltip.bind(this);
    }

    progressBarLabel() {
        return `#${this.props.monster.number} ${this.props.monster.currentHp} / ${this.props.monster.hp}`;
    }

    calcHpRatio() {
        return this.props.monster.currentHp / this.props.monster.hp * 100 + "%";
    }

    //#region event handlers
    /**
     * onClick - Turn on hp field mode
     */
    click() {
        if (!this.state.hpFormMode) {
            this.setState({ hpFormMode: true, popoverVisible: false });
        }
    }

    /**
     * onWheel - change hp if not on hp field mode
     */
    doChangeHp(e: WheelEvent) {
        if (this.state.hpFormMode) {
            return;
        }
        e.preventDefault();
        e.stopPropagation();
        const delta = e.deltaY;
        const hpChange = delta > 0 ? -1 : 1;
        const newHp = validHp(this.props.monster.hp, this.props.monster.currentHp + hpChange);
        const oldHp = this.props.monster.currentHp

        this.props.onMonsterHpChange(this.props.monster, newHp).then(() => {
            this.setState((prevState) => {
                const popoverInitHp = prevState.popoverVisible ? prevState.popoverInitHp : oldHp;
                return { popoverInitHp, popoverVisible: true };
            });
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
        if (!this.state.hpFormMode) {
            this.popoverFadeTimeout = setTimeout(this.killPopover, MonsterHpBarPop.FadeTime);
        }
    }

    /**
     * onHide - changes the state to destroy popover
     */
    killPopover() {
        this.setState({ popoverVisible: false });
    }

    /**
     * onHpChange of hp form value
     */
    handleChangeHpFormValue(newValue: number) {
        this.props.onMonsterHpChange(this.props.monster, validHp(this.props.monster.hp, newValue)).then(() => {
            this.setState({ hpFormMode: false });
        });
    }

    /**
     * onCancel of hp form
     */
    handleChangeHpFormCancel() {
        this.setState({ hpFormMode: false });
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

    renderHpChangeForm() {
        return (
            <div className="Monster-hp-bar">
                <MonsterHpBarForm currentHp={this.props.monster.currentHp} maxHp={this.props.monster.hp} onHpChange={this.handleChangeHpFormValue} onCancel={this.handleChangeHpFormCancel} />
            </div>
        );
    }

    renderWithPopover(progressBar: JSX.Element) {
        const popProps = {
            idProp: this.props.monster.storageId,
            hpChange: this.props.monster.currentHp - this.state.popoverInitHp,
            target: () => this.progressBarDiv,
            show: this.state.popoverVisible,
            fade: !this.state.mouseIn,
            onHide: this.killPopover
        };
        return (
            <div>
                {progressBar}
                <MonsterHpBarPop {...popProps} />
            </div>
        );
    }

    renderWithTooltip(progressBar: JSX.Element) {
        const tooltip = <Tooltip id={`tooltip-${this.props.monster.storageId}`}>{this.title}</Tooltip>;
        return <OverlayTrigger placement="top" overlay={tooltip} delay={200}>{progressBar}</OverlayTrigger>;
    }
    //#endregion

    render() {
        if (this.state.hpFormMode) {
            return this.renderHpChangeForm();
        }
        if (this.state.popoverVisible) {
            return this.renderWithPopover(this.renderProgressBar());
        }
        return this.renderWithTooltip(this.renderProgressBar());
    }
}

export default MonsterHpBar;