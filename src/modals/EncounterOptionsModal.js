import { Button, FormControl, FormGroup, Glyphicon, InputGroup, ListGroup, ListGroupItem } from 'react-bootstrap';
import React, { Component } from 'react';

import BhModal from "./BhModal";
import C from "../Constants";
import ColorPicker from "./ColorPicker";
import ColorService from "../services/ColorService";
import DiceExp from "../services/DiceExp";
import LinkService from "../services/LinkService";
import MonsterEncounterData from '../data/MonsterEncounterData';
import OptionLine from "./OptionLine";
import SampleHpBar from '../SampleHpBar';
import TextField from "./TextField";

class EncounterOptionsModal extends Component {
    constructor(props) {
        super(props);

        const encounter: MonsterEncounterData = props.encounter || {};

        this.state = {
            showCustomize: false,
            showNewMonster: false,
            showColorPicker: false,
            showTextColorPicker: false,
            name: encounter && encounter.name || "",
            color: encounter && encounter.color,
            textColor: encounter && encounter.textColor,
            monsterName: "",
            monsterHp: ""
        };
    }

    title = () => {
        if (this.state.showNewMonster) return "New Custom Monster";
        return this.props.encounter && this.props.encounter.name;
    }

    hasLists = () => {
        return this.props.encounter && this.props.encounter.lists && this.props.encounter.lists.length > 0;
    }

    //#region customizations
    toCustomizeOptions = () => {
        this.setState({ showCustomize: true });
    }

    saveCustomize = () => {
        this.props.onCustomizeSave({
            name: this.state.name,
            color: this.state.color,
            textColor: this.state.textColor
        });
    }

    renderCustomize = () => {
        return (
            <ListGroup>
                <OptionLine>
                    <SampleHpBar label="#1 100 / 100" color={this.state.color} textColor={this.state.textColor} />
                </OptionLine>
                <OptionLine>
                    <TextField label="Name" value={this.state.name} valuePropName="name" maxLength="30" onEnter={this.saveCustomize} container={this} />
                </OptionLine>
                <OptionLine>
                    <ColorPicker
                        label="Hp Bar Color"
                        showPicker={this.state.showColorPicker}
                        onTogglePicker={ColorService.onToggleFunc("showColorPicker", this)}
                        color={this.state.color}
                        defaultColor={C.DefaultMonsterColor}
                        presetColors={C.PresetMonsterColor}
                        onChange={ColorService.onChangeFunc("color", this)}
                    />
                </OptionLine>
                <OptionLine>
                    <ColorPicker
                        label="Hp Bar Text Color"
                        showPicker={this.state.showTextColorPicker}
                        onTogglePicker={ColorService.onToggleFunc("showTextColorPicker", this)}
                        color={this.state.textColor}
                        defaultColor={C.DefaultMonsterTextColor}
                        presetColors={C.PresetMonsterTextColor}
                        onChange={ColorService.onChangeFunc("textColor", this)}
                    />
                </OptionLine>
            </ListGroup>
        );
    }

    renderCustomizeFooter = () => {
        return (
            <div>
                <Button bsSize="small" bsStyle="primary" onClick={this.saveCustomize}>Save</Button>
                <Button bsSize="small" onClick={this.props.onHide}>Cancel</Button>
            </div>
        );
    }
    //#endregion

    //#region new custom monster
    toNewMonsterOptions = () => {
        this.setState({ showNewMonster: true });
    }

    validateMonsterName = () => {
        return !this.state.monsterName || !this.state.monsterName.trim() ? "error" : "success";
    }

    validateHpExp = () => {
        return !this.state.monsterHp || this.state.monsterHp === "0" || !DiceExp.isDiceExp(this.state.monsterHp) ? "error" : "success";
    }

    isValidMonster = () => {
        return this.validateMonsterName() === "success" && this.validateHpExp() === "success";
    }

    saveNewMonster = () => {
        if (!this.isValidMonster()) return;
        this.props.onNewMonserSave({
            name: this.state.monsterName,
            hpexp: this.state.monsterHp
        });
    }

    renderNewMonster = () => {
        return (
            <ListGroup>
                <OptionLine>
                    <TextField
                        label="Name" value={this.state.monsterName}
                        valuePropName="monsterName" maxLength="40"
                        validationState={this.validateMonsterName()}
                        onEnter={this.saveNewMonster} container={this}
                    />
                </OptionLine>
                <OptionLine>
                    <TextField
                        label="HP Expression" value={this.state.monsterHp}
                        valuePropName="monsterHp" maxLength="10"
                        validationState={this.validateHpExp()}
                        onEnter={this.saveNewMonster} container={this}
                    />
                </OptionLine>
            </ListGroup>
        );
    }

    renderNewMonsterFooter = () => {
        return (
            <div>
                <Button bsSize="small" bsStyle="primary" onClick={this.saveNewMonster} disabled={!this.isValidMonster()}>Save</Button>
                <Button bsSize="small" onClick={this.props.onHide}>Cancel</Button>
            </div>
        );
    }
    //#endregion

    renderBaseOptions = () => {
        return (
            <ListGroup>
                <OptionLine onClick={this.toCustomizeOptions} icon="pencil">Customize</OptionLine>
                <OptionLine onClick={this.toNewMonsterOptions} icon="file">New Custom Monster</OptionLine>
                <OptionLine onClick={this.props.onCollapse} disabled={!this.hasLists()} icon="resize-small">Collapse All</OptionLine>
                <OptionLine onClick={this.props.onExpand} disabled={!this.hasLists()} icon="resize-full">Expand All</OptionLine>
                <OptionLine onClick={this.props.onKill} disabled={!this.hasLists()} icon="thumbs-down">Kill All (0HP)</OptionLine>
                <OptionLine onClick={this.props.onFullHeal} disabled={!this.hasLists()} icon="heart">Full Heal All</OptionLine>
                <hr />
                <OptionLine onClick={this.props.onDelete} disabled={!this.props.context.deleteEnabled} icon="trash">
                    Delete Encounter
                </OptionLine>
            </ListGroup>
        );
    }

    renderBody = () => {
        if (this.state.showCustomize) return this.renderCustomize();
        if (this.state.showNewMonster) return this.renderNewMonster();
        return this.renderBaseOptions();
    }

    renderFooter = () => {
        if (this.state.showCustomize) return this.renderCustomizeFooter();
        if (this.state.showNewMonster) return this.renderNewMonsterFooter();
        return null;
    }

    render() {
        return (
            <BhModal
                show={this.props.show}
                onHide={this.props.onHide}
                title={this.title()}
                body={this.renderBody()}
                footer={this.renderFooter()}
            />
        );
    }
}

export default EncounterOptionsModal;