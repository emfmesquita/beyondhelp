import { Button, FormControl, FormGroup, Glyphicon, InputGroup, ListGroup, ListGroupItem } from 'react-bootstrap';
import React, { Component } from 'react';

import BhModal from "./BhModal";
import C from "../Constants";
import ColorPicker from "../forms/ColorPicker";
import DiceExp from "../services/DiceExp";
import FieldService from "../services/FieldService";
import MonsterEncounterData from '../data/MonsterEncounterData';
import MonsterListStorageService from "../services/storage/MonsterListStorageService";
import MonsterStorageService from "../services/storage/MonsterStorageService";
import MonstersService from "../services/MonstersService";
import OptionLine from "../forms/OptionLine";
import SampleHpBar from '../SampleHpBar';
import StorageService from "../services/storage/StorageService";
import TextField from "../forms/TextField";

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

    //#region base options
    hasLists = () => {
        return this.props.encounter && this.props.encounter.lists && this.props.encounter.lists.length > 0;
    }

    areAllCollapsedExpanded = (collapsed: boolean) => {
        const encounter: MonsterEncounterData = this.props.encounter;
        if (!encounter) return false;
        if (!encounter.lists) return true;
        return encounter.lists.every(list => collapsed && list.collapsed || !collapsed && !list.collapsed);
    }

    areAllCollapsed = () => {
        return this.areAllCollapsedExpanded(true);
    }

    areAllExpanded = () => {
        return this.areAllCollapsedExpanded(false);
    }

    openDetailsDisabled = () => {
        return MonstersService.notCustomMonsterLists(this.props.encounter).length === 0;
    }

    handleOpenDetails = () => {
        const tabCount = MonstersService.notCustomMonsterLists(this.props.encounter).length;
        if (tabCount > 5) {
            this.props.onOpenDetailsPages();
            return;
        }

        this.props.onHide();
        MonstersService.openDetailsPages(this.props.encounter);
        return;
    }

    fullHealEncounter = () => {
        const encounter: MonsterEncounterData = this.props.encounter;
        let monsters = [];
        encounter.lists.forEach(list => monsters = monsters.concat(list.monsters));
        monsters.forEach(monster => monster.currentHp = monster.hp);
        StorageService.updateData(monsters).then(this.props.onChange);
    }

    KillEncounter = () => {
        const encounter: MonsterEncounterData = this.props.encounter;
        let monsters = [];
        encounter.lists.forEach(list => monsters = monsters.concat(list.monsters));
        monsters.forEach(monster => monster.currentHp = 0);
        StorageService.updateData(monsters).then(this.props.onChange);
    }

    colapseEncounter = () => {
        const encounter: MonsterEncounterData = this.props.encounter;
        encounter.lists.forEach(list => list.collapsed = true);
        StorageService.updateData(encounter.lists).then(this.props.onChange);
    }

    expandEncounter = () => {
        const encounter: MonsterEncounterData = this.props.encounter;
        encounter.lists.forEach(list => list.collapsed = false);
        StorageService.updateData(encounter.lists).then(this.props.onChange);
    }

    renderBaseOptions = () => {
        return (
            <ListGroup>
                <OptionLine onClick={this.toCustomizeOptions} icon="pencil">Customize</OptionLine>
                <OptionLine onClick={this.toNewMonsterOptions} icon="file">New Custom Monster</OptionLine>
                <OptionLine onClick={this.handleOpenDetails} disabled={this.openDetailsDisabled()} icon="list-alt">Open All Details Pages</OptionLine>
                <OptionLine onClick={this.colapseEncounter} disabled={!this.hasLists() || this.areAllCollapsed()} icon="resize-small">Collapse All</OptionLine>
                <OptionLine onClick={this.expandEncounter} disabled={!this.hasLists() || this.areAllExpanded()} icon="resize-full">Expand All</OptionLine>
                <OptionLine onClick={this.KillEncounter} disabled={!this.hasLists()} icon="thumbs-down">Kill All (0HP)</OptionLine>
                <OptionLine onClick={this.fullHealEncounter} disabled={!this.hasLists()} icon="heart">Full Heal All</OptionLine>
                <hr />
                <OptionLine onClick={this.props.onDelete} disabled={!this.props.context.deleteEnabled} icon="trash">
                    Delete Encounter
                    </OptionLine>
            </ListGroup>
        );
    }
    //#endregion

    //#region customizations
    toCustomizeOptions = () => {
        this.setState({ showCustomize: true });
    }

    validateEncounterName = () => {
        return !this.state.name || !this.state.name.trim() ? "error" : "success";
    }

    saveCustomize = () => {
        if (this.validateEncounterName() === "error") return;
        const encounter: MonsterEncounterData = this.props.encounter;
        encounter.name = this.state.name;
        encounter.color = this.state.color;
        encounter.textColor = this.state.textColor;
        StorageService.updateData(encounter).then(this.props.onChange);
    }

    renderCustomize = () => {
        return (
            <ListGroup>
                <OptionLine>
                    <SampleHpBar label="#1 100 / 100" color={this.state.color} textColor={this.state.textColor} />
                </OptionLine>
                <OptionLine>
                    <TextField
                        label="Name" value={this.state.name}
                        valuePropName="name" maxLength="30"
                        validationState={this.validateEncounterName()}
                        onEnter={this.saveCustomize} container={this}
                    />
                </OptionLine>
                <OptionLine>
                    <ColorPicker
                        label="Hp Bar Color"
                        showPicker={this.state.showColorPicker}
                        onTogglePicker={FieldService.onToggleFunc("showColorPicker", this)}
                        color={this.state.color}
                        defaultColor={C.DefaultMonsterColor}
                        presetColors={C.PresetMonsterColor}
                        onChange={FieldService.onColorChangeFunc("color", this)}
                    />
                </OptionLine>
                <OptionLine>
                    <ColorPicker
                        label="Hp Bar Text Color"
                        showPicker={this.state.showTextColorPicker}
                        onTogglePicker={FieldService.onToggleFunc("showTextColorPicker", this)}
                        color={this.state.textColor}
                        defaultColor={C.DefaultMonsterTextColor}
                        presetColors={C.PresetMonsterTextColor}
                        onChange={FieldService.onColorChangeFunc("textColor", this)}
                    />
                </OptionLine>
            </ListGroup>
        );
    }

    renderCustomizeFooter = () => {
        return (
            <div>
                <Button bsSize="small" bsStyle="primary" onClick={this.saveCustomize} disabled={this.validateEncounterName() === "error"}>Save</Button>
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
        const encounter: MonsterEncounterData = this.props.encounter;
        const name = this.state.monsterName;
        const hp = this.state.monsterHp;
        MonsterListStorageService.createCustomList(name, hp, encounter).then(list => {
            return MonsterStorageService.createMonster(list.monsterId, list.name, hp);
        }).then(this.props.onChange);
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