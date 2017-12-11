import { Button, FormControl, FormGroup, Glyphicon, InputGroup, ListGroup, ListGroupItem } from 'react-bootstrap';
import React, { Component } from 'react';

import BhModal from "./BhModal";
import C from "../Constants";
import ColorPicker from "./ColorPicker";
import ColorService from "../services/ColorService";
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
            showColorPicker: false,
            showTextColorPicker: false,
            name: encounter && encounter.name,
            color: encounter && encounter.color,
            textColor: encounter && encounter.textColor
        };
    }

    hasLists = () => {
        return this.props.encounter && this.props.encounter.lists && this.props.encounter.lists.length > 0;
    }

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

    renderBaseOptions = () => {
        return (
            <ListGroup>
                <OptionLine onClick={this.toCustomizeOptions} icon="pencil">Customize</OptionLine>
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

    renderCustomize = () => {
        return (
            <ListGroup>
                <OptionLine>
                    <SampleHpBar label="#1 100 / 100" color={this.state.color} textColor={this.state.textColor} />
                </OptionLine>
                <OptionLine>
                    <TextField label="Name" value={this.state.name} valuePropName="name" onEnter={this.saveCustomize} container={this} />
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

    render() {
        return (
            <BhModal
                show={this.props.show}
                onHide={this.props.onHide}
                title={this.props.encounter && this.props.encounter.name}
                body={this.state.showCustomize ? this.renderCustomize() : this.renderBaseOptions()}
                footer={this.state.showCustomize ? this.renderCustomizeFooter() : null}
            />
        );
    }
}

export default EncounterOptionsModal;