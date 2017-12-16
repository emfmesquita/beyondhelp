import { Button, FormControl, FormGroup, Glyphicon, InputGroup, ListGroup, ListGroupItem } from 'react-bootstrap';
import React, { Component } from 'react';

import BhModal from "./BhModal";
import C from "../Constants";
import ColorPicker from "../forms/ColorPicker";
import ColorService from "../services/ColorService";
import DiceExp from "../services/DiceExp";
import FieldService from "../services/FieldService";
import LinkService from "../services/LinkService";
import MonsterEncounterData from '../data/MonsterEncounterData';
import MonsterListData from '../data/MonsterListData';
import MonsterStorageService from "../services/storage/MonsterStorageService";
import OptionLine from "../forms/OptionLine";
import SampleHpBar from '../SampleHpBar';
import StorageService from "../services/storage/StorageService";
import TextField from "../forms/TextField";

class ListOptionsModal extends Component {
    constructor(props) {
        super(props);

        const list: MonsterListData = props.context.list || {};

        this.state = {
            showCustomize: false,
            showColorPicker: false,
            showTextColorPicker: false,
            showHeaderColorPicker: false,
            color: list.color,
            textColor: list.textColor,
            headerColor: list.headerColor,
            customMonsterName: list.name,
            customMonsterHp: list.hpexp
        };

        this.toMonsterPageHandler = LinkService.toNewTabHandler(`https://www.dndbeyond.com/monsters/${list.monsterId}`);
    }

    title = () => {
        const list: MonsterListData = this.props.context.list || {};
        return `List - ${list.name}`;
    }

    isFirstOrLast = (first: boolean) => {
        const list: MonsterListData = this.props.context.list;
        if (!list) return false;
        const encounter: MonsterEncounterData = this.props.encounter;
        return encounter.lists.indexOf(list) === first ? 0 : encounter.lists.length - 1;
    }

    isFirst = () => {
        this.isFirstOrLast(true);
    }

    isLast = () => {
        this.isFirstOrLast(false);
    }

    toDetailsPage = (e: MouseEvent) => {
        this.toMonsterPageHandler(e);
        this.props.onHide();
    }

    moveList = (delta: number) => {
        const list: MonsterListData = this.props.context.list;
        const encounter: MonsterEncounterData = this.props.encounter;
        const idx = encounter.lists.indexOf(list);
        const newIdx = idx + delta;
        if (newIdx < 0 || newIdx >= encounter.lists.length) {
            this.props.onHide();
            return;
        }
        const toSwapList = encounter.lists[newIdx];
        const tempOrder = list.order;
        list.order = toSwapList.order;
        toSwapList.order = tempOrder;
        encounter.lists[idx] = toSwapList;
        encounter.lists[newIdx] = list;
        StorageService.updateData([list, toSwapList]).then(this.props.onChange);
    }

    moveListUp = () => {
        this.moveList(-1);
    }

    moveListDown = () => {
        this.moveList(1);
    }

    fullHealList = () => {
        const list: MonsterListData = this.props.context.list;
        list.monsters.forEach(monster => monster.currentHp = monster.hp);
        StorageService.updateData(list.monsters).then(this.props.onChange);
    }

    killList = () => {
        const list: MonsterListData = this.props.context.list;
        list.monsters.forEach(monster => monster.currentHp = 0);
        StorageService.updateData(list.monsters).then(this.props.onChange);
    }

    //#region custom monster
    isCustom = () => {
        const list: MonsterListData = this.props.context.list;
        if (!list || !list.monsterId) return false;
        return list.monsterId.startsWith("bh-");
    }

    validateMonsterName = () => {
        return !this.state.customMonsterHp || !this.state.customMonsterHp.trim() ? "error" : "success";
    }

    validateHpExp = () => {
        return !this.state.customMonsterHp || this.state.customMonsterHp === "0" || !DiceExp.isDiceExp(this.state.customMonsterHp) ? "error" : "success";
    }

    isValidMonster = () => {
        return this.validateMonsterName() === "success" && this.validateHpExp() === "success";
    }

    addCustomMonster = () => {
        const list: MonsterListData = this.props.context.list;
        MonsterStorageService.createMonster(list.monsterId, list.name, list.hpexp).then(this.props.onChange);
    }

    renderCustomMonsterOptions = () => {
        if (!this.isCustom()) return null;

        return [
            <OptionLine>
                <TextField
                    label="Name" value={this.state.customMonsterName}
                    valuePropName="customMonsterName" maxLength="40"
                    validationState={this.validateMonsterName()}
                    onEnter={this.saveCustomize} container={this}
                />
            </OptionLine>,
            <OptionLine>
                <TextField
                    label="HP Expression" value={this.state.customMonsterHp}
                    valuePropName="customMonsterHp" maxLength="10"
                    validationState={this.validateHpExp()}
                    onEnter={this.saveCustomize} container={this}
                />
            </OptionLine>
        ];
    }
    //#endregion

    //#region customizations
    toCustomizeOptions = () => {
        this.setState({ showCustomize: true });
    }

    isSaveDisabled = () => {
        return this.isCustom() && !this.isValidMonster();
    }

    saveCustomize = () => {
        if (this.isSaveDisabled()) return;
        const list: MonsterListData = this.props.context.list;
        list.color = this.state.color;
        list.textColor = this.state.textColor;
        list.headerColor = this.state.headerColor;
        if (this.isCustom()) {
            list.name = this.state.customMonsterName;
            list.hpexp = this.state.customMonsterHp;
        }
        StorageService.updateData(list).then(this.props.onChange);
    }

    renderCustomize = () => {
        return (
            <ListGroup>
                <OptionLine>
                    <div style={{ color: ColorService.listHeaderTextColor(this.state.headerColor) }}>
                        {this.props.context.list && this.props.context.list.name}
                    </div>
                    <SampleHpBar label="#1 100 / 100" color={this.state.color || this.props.encounter.color} textColor={this.state.textColor || this.props.encounter.textColor} />
                </OptionLine>
                {this.renderCustomMonsterOptions()}
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
                <OptionLine>
                    <ColorPicker
                        label="Header Text Color"
                        showPicker={this.state.showHeaderColorPicker}
                        onTogglePicker={FieldService.onToggleFunc("showHeaderColorPicker", this)}
                        color={this.state.headerColor}
                        defaultColor={C.DefaultListHeaderColor}
                        presetColors={C.PresetListHeaderColor}
                        onChange={FieldService.onColorChangeFunc("headerColor", this)}
                    />
                </OptionLine>
            </ListGroup>
        );
    }

    renderCustomizeFooter = () => {
        return (
            <div>
                <Button bsSize="small" bsStyle="primary" onClick={this.saveCustomize} disabled={this.isSaveDisabled()}>Save</Button>
                <Button bsSize="small" onClick={this.props.onHide}>Cancel</Button>
            </div>
        );
    }
    //#endregion

    renderBaseOptions = () => {
        return (
            <ListGroup>
                <OptionLine onClick={this.toCustomizeOptions} icon="pencil">Customize</OptionLine>
                {!this.isCustom() && <OptionLine onClick={this.toDetailsPage} icon="list-alt">Open Details Page</OptionLine>}
                {this.isCustom() && <OptionLine onClick={this.addCustomMonster} icon="plus-sign">Add Monster</OptionLine>}
                <OptionLine onClick={this.moveListUp} disabled={this.isFirst()} icon="arrow-up">Move Up</OptionLine>
                <OptionLine onClick={this.moveListDown} disabled={this.isLast()} icon="arrow-down">Move Down</OptionLine>
                <OptionLine onClick={this.killList} icon="thumbs-down">Kill All (0HP)</OptionLine>
                <OptionLine onClick={this.fullHealList} icon="heart">Full Heal All</OptionLine>
                <hr />
                <OptionLine onClick={this.props.onDelete} icon="trash">Delete All</OptionLine>
            </ListGroup>
        );
    }

    render() {
        return (
            <BhModal
                show={this.props.show}
                onHide={this.props.onHide}
                title={this.title()}
                body={this.state.showCustomize ? this.renderCustomize() : this.renderBaseOptions()}
                footer={this.state.showCustomize ? this.renderCustomizeFooter() : null}
            />
        );
    }
}

export default ListOptionsModal;