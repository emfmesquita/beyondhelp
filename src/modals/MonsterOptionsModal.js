import { Button, FormControl, FormGroup, Glyphicon, InputGroup, ListGroup, ListGroupItem } from 'react-bootstrap';
import React, { Component } from 'react';

import BadgeService from "../services/BadgeService";
import BhModal from "./BhModal";
import C from "../Constants";
import ColorPicker from "../forms/ColorPicker";
import FieldService from "../services/FieldService";
import LinkService from "../services/LinkService";
import MonsterData from '../data/MonsterData';
import MonsterStorageService from "../services/storage/MonsterStorageService";
import OptionLine from "../forms/OptionLine";
import SampleHpBar from '../SampleHpBar';
import SyncStorageService from "../services/storage/SyncStorageService";
import TextField from "../forms/TextField";
import MonsterListData from '../data/MonsterListData';

const maxHpRegex = /^[0-9]+$/i;

class MonsterOptionsModal extends Component {
    constructor(props) {
        super(props);

        const monster: MonsterData = props.context.monster || {};
        const list: MonsterListData = props.context.list || {};

        this.state = {
            showCustomize: false,
            showColorPicker: false,
            showTextColorPicker: false,
            name: monster.name || "",
            hp: monster.hp,
            color: monster.color,
            textColor: monster.textColor
        };

        this.toMonsterPageHandler = LinkService.toNewTabHandler(`https://www.dndbeyond.com/monsters/${list.monsterId}`);
    }

    buildTitle = () => {
        const list = this.props.context.list;
        const mon = this.props.context.monster;
        if (!list || !mon) return "";
        if (mon.name) return mon.name;
        return `${list.name} #${mon.number}`;
    }

    isFirstOrLast = (first: boolean) => {
        const monster: MonsterData = this.props.context.monster;
        if (!monster) return false;
        const list: MonsterListData = this.props.context.list;
        return list.monsters.indexOf(monster) === (first ? 0 : list.monsters.length - 1);
    }

    isFirst = () => {
        return this.isFirstOrLast(true);
    }

    isLast = () => {
        return this.isFirstOrLast(false);
    }

    sampleLabel = () => {
        const monster = this.props.context.monster;
        const name = this.state.name ? this.state.name : `#${monster.number}`;
        return `${name} ${this.state.hp} / ${this.state.hp}`;
    }

    sampleColor = () => {
        const list = this.props.context.list;
        return this.state.color || list && list.color || this.props.encounter.color;
    }

    sampleTextColor = () => {
        const list = this.props.context.list;
        return this.state.textColor || list && list.textColor || this.props.encounter.textColor;
    }

    isCustom = () => {
        const list: MonsterListData = this.props.context.list;
        if (!list || !list.monsterId) return false;
        return list.monsterId.startsWith("bh-");
    }

    toDetailsPage = (e: MouseEvent) => {
        this.toMonsterPageHandler(e);
        this.props.onHide();
    }

    addCustomMonster = () => {
        const list: MonsterListData = this.props.context.list;
        MonsterStorageService.createMonster(list.monsterId, list.name, list.hpexp).then(this.props.onChange);
    }

    move = (delta: number) => {
        const monster: MonsterData = this.props.context.monster;
        const list: MonsterListData = this.props.context.list;
        const idx = list.monsters.indexOf(monster);
        const newIdx = idx + delta;
        if (newIdx < 0 || newIdx >= list.monsters.length) {
            this.props.onHide();
            return;
        }
        const toSwapMonster = list.monsters[newIdx];
        const tempOrder = monster.order;
        monster.order = toSwapMonster.order;
        toSwapMonster.order = tempOrder;
        list.monsters[idx] = toSwapMonster;
        list.monsters[newIdx] = monster;
        SyncStorageService.updateData([monster, toSwapMonster]).then(this.props.onChange);
    }

    moveUp = () => {
        this.move(-1);
    }

    moveDown = () => {
        this.move(1);
    }

    toCustomizeOptions = () => {
        this.setState({ showCustomize: true });
    }

    validateCustomize = () => {
        return !this.state.hp || !maxHpRegex.test(this.state.hp) ? "error" : "success";
    }

    deleteMonster = () => {
        const monster: MonsterData = this.props.context.monster;
        const monsterEl = this.props.context.monsterEl;
        this.props.onHide();
        $(monsterEl).fadeOut(400, () => {
            MonsterStorageService.deleteMonster(monster).then(() => {
                BadgeService.updateBadgeCount();
                this.props.onChange();
            });
        });
    }

    fullHealMonster = () => {
        const monster: MonsterData = this.props.context.monster;
        monster.currentHp = monster.hp;
        SyncStorageService.updateData(monster).then(this.props.onChange);
    }

    killMonster = () => {
        const monster: MonsterData = this.props.context.monster;
        monster.currentHp = 0;
        SyncStorageService.updateData(monster).then(this.props.onChange);
    }

    saveCustomize = () => {
        if (this.validateCustomize() === "error") return;
        const monster: MonsterData = this.props.context.monster;
        monster.name = this.state.name;
        monster.color = this.state.color;
        monster.textColor = this.state.textColor;
        monster.hp = parseInt(this.state.hp);
        if (monster.currentHp > monster.hp) {
            monster.currentHp = monster.hp;
        }
        SyncStorageService.updateData(monster).then(this.props.onChange);
    }

    renderBaseOptions = () => {
        return (
            <ListGroup>
                <OptionLine onClick={this.toCustomizeOptions} icon="pencil">Customize</OptionLine>
                {!this.isCustom() && <OptionLine onClick={this.toDetailsPage} icon="list-alt">Open Details Page</OptionLine>}
                {this.isCustom() && <OptionLine onClick={this.addCustomMonster} icon="plus-sign">Add Monster</OptionLine>}
                <OptionLine onClick={this.moveUp} disabled={this.isFirst()} icon="arrow-up">Move Up</OptionLine>
                <OptionLine onClick={this.moveDown} disabled={this.isLast()} icon="arrow-down">Move Down</OptionLine>
                <OptionLine onClick={this.killMonster} icon="thumbs-down">Kill (0HP)</OptionLine>
                <OptionLine onClick={this.fullHealMonster} icon="heart">Full Heal</OptionLine>
                <hr />
                <OptionLine onClick={this.deleteMonster} icon="trash">Delete</OptionLine>
            </ListGroup>
        );
    }

    renderCustomize = () => {
        return (
            <ListGroup>
                <OptionLine>
                    <SampleHpBar label={this.sampleLabel()} color={this.sampleColor()} textColor={this.sampleTextColor()} />
                </OptionLine>
                <OptionLine>
                    <TextField label="Name" value={this.state.name} valuePropName="name" maxLength="20" onEnter={this.saveCustomize} container={this} />
                </OptionLine>
                <OptionLine>
                    <TextField label="Max HP" value={this.state.hp} valuePropName="hp" maxLength="7" onEnter={this.saveCustomize} validationState={this.validateCustomize()} container={this} />
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
                <Button bsSize="small" bsStyle="primary" onClick={this.saveCustomize} disabled={this.validateCustomize() !== "success"}>Save</Button>
                <Button bsSize="small" onClick={this.props.onHide}>Cancel</Button>
            </div>
        );
    }

    render() {
        return (
            <BhModal
                show={this.props.show}
                onHide={this.props.onHide}
                title={this.buildTitle()}
                body={this.state.showCustomize ? this.renderCustomize() : this.renderBaseOptions()}
                footer={this.state.showCustomize ? this.renderCustomizeFooter() : null}
            />
        );
    }
}

export default MonsterOptionsModal;