import { Button, FormControl, FormGroup, Glyphicon, InputGroup, ListGroup, ListGroupItem } from 'react-bootstrap';
import React, { Component } from 'react';

import BhModal from "./BhModal";
import C from "../Constants";
import ColorPicker from "./ColorPicker";
import ColorService from "../services/ColorService";
import LinkService from "../services/LinkService";
import MonsterListData from '../data/MonsterListData';
import OptionLine from "./OptionLine";
import SampleHpBar from '../SampleHpBar';
import TextField from "./TextField";

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
            headerColor: list.headerColor
        };

        this.toMonsterPageHandler = LinkService.toNewTabHandler(`https://www.dndbeyond.com/monsters/${list.monsterId}`);
    }

    toCustomizeOptions = () => {
        this.setState({ showCustomize: true });
    }

    toDetailsPage = (e: MouseEvent) => {
        this.toMonsterPageHandler(e);
        this.props.onHide();
    }

    saveCustomize = () => {
        this.props.onCustomizeSave({
            color: this.state.color,
            textColor: this.state.textColor,
            headerColor: this.state.headerColor
        });
    }

    renderBaseOptions = () => {
        return (
            <ListGroup>
                <OptionLine onClick={this.toCustomizeOptions} icon="pencil">Customize</OptionLine>
                <OptionLine onClick={this.toDetailsPage} icon="list-alt">Open Details Page</OptionLine>
                <OptionLine onClick={this.props.onKill} icon="thumbs-down">Kill All (0HP)</OptionLine>
                <OptionLine onClick={this.props.onFullHeal} icon="heart">Full Heal All</OptionLine>
                <hr />
                <OptionLine onClick={this.props.onDelete} icon="trash">Delete All</OptionLine>
            </ListGroup>
        );
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
                <OptionLine>
                    <ColorPicker
                        label="Header Text Color"
                        showPicker={this.state.showHeaderColorPicker}
                        onTogglePicker={ColorService.onToggleFunc("showHeaderColorPicker", this)}
                        color={this.state.headerColor}
                        defaultColor={C.DefaultListHeaderColor}
                        presetColors={C.PresetListHeaderColor}
                        onChange={ColorService.onChangeFunc("headerColor", this)}
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

    render() {
        return (
            <BhModal
                show={this.props.show}
                onHide={this.props.onHide}
                title={this.props.context.list && this.props.context.list.name}
                body={this.state.showCustomize ? this.renderCustomize() : this.renderBaseOptions()}
                footer={this.state.showCustomize ? this.renderCustomizeFooter() : null}
            />
        );
    }
}

export default ListOptionsModal;