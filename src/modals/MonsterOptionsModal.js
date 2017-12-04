import "./MonsterOptionsModal.scss";

import { Button, FormControl, FormGroup, Glyphicon, InputGroup, ListGroup, ListGroupItem, Modal } from 'react-bootstrap';
import { GithubPicker, SketchPicker, TwitterPicker } from 'react-color';
import React, { Component } from 'react';

import C from "../Constants";
import ColorPicker from "./ColorPicker";
import MonsterData from '../data/MonsterData';
import MonsterMenuButton from '../monsterbuttons/MonsterMenuButton';
import OptionLine from "./OptionLine";
import SampleHpBar from '../SampleHpBar';
import TextFieldService from "../services/TextFieldService";

const maxHpRegex = /^[0-9]+$/i;

class MonsterOptionsModal extends Component {
    constructor(props) {
        super(props);

        const monster: MonsterData = props.context.monster;
        const color = monster && (monster.color ? monster.color : C.DefaultMonsterColor);
        const textColor = monster && (monster.textColor ? monster.textColor : C.DefaultMonsterTextColor);

        this.state = {
            showCustomize: false,
            showColorPicker: false,
            showTextColorPicker: false,
            name: monster && monster.name,
            hp: monster && monster.hp,
            color,
            textColor
        };

        this.buildTitle = this.buildTitle.bind(this);
        this.sampleLabel = this.sampleLabel.bind(this);
        this.toNameAndColorOptions = this.toNameAndColorOptions.bind(this);
        this.validateCustomize = this.validateCustomize.bind(this);
        this.saveCustomize = this.saveCustomize.bind(this);

        this.renderBaseOptions = this.renderBaseOptions.bind(this);
        this.renderCustomize = this.renderCustomize.bind(this);
        this.renderCustomizeFooter = this.renderCustomizeFooter.bind(this);
    }

    buildTitle() {
        const list = this.props.context.list;
        const mon = this.props.context.monster;
        if (!list || !mon) return "";
        if (mon.name) return mon.name;
        return `${list.name} #${mon.number}`;
    }

    sampleLabel() {
        const monster = this.props.context.monster;
        const name = this.state.name ? this.state.name : `#${monster.number}`;
        return `${name} ${this.state.hp} / ${this.state.hp}`;
    }

    toNameAndColorOptions() {
        this.setState({ showCustomize: true });
    }

    saveCustomize() {
        if (this.validateCustomize() === "error") return;
        this.props.onCustomizeSave({
            name: this.state.name,
            hp: parseInt(this.state.hp),
            color: this.state.color,
            textColor: this.state.textColor
        });
    }

    validateCustomize() {
        return !this.state.hp || !maxHpRegex.test(this.state.hp) ? "error" : "success";
    }

    renderBaseOptions() {
        return (
            <ListGroup>
                <OptionLine onClick={this.toNameAndColorOptions} icon="pencil">Customize</OptionLine>
                <OptionLine onClick={this.props.onKill} icon="thumbs-down">Kill (0HP)</OptionLine>
                <OptionLine onClick={this.props.onFullHeal} icon="heart">Full Heal</OptionLine>
                <hr />
                <OptionLine onClick={this.props.onDelete} icon="trash">Delete</OptionLine>
            </ListGroup>
        );
    }

    renderCustomize() {
        return (
            <ListGroup>
                <OptionLine>
                    <SampleHpBar label={this.sampleLabel()} color={this.state.color} textColor={this.state.textColor} />
                </OptionLine>
                <OptionLine>
                    <span>Name</span>
                    <InputGroup bsSize="small">
                        <FormControl
                            type="text"
                            style={{ height: "32px" }}
                            value={this.state.name}
                            onChange={TextFieldService.onChangeMethod("name", this)}
                            onKeyDown={TextFieldService.onKeyDownMethod(this.saveCustomize, this)}
                            maxLength="25"
                        />
                    </InputGroup>
                </OptionLine>
                <OptionLine>
                    <span>Max HP</span>
                    <FormGroup bsSize="small" validationState={this.validateCustomize()}>
                        <FormControl
                            type="text"
                            style={{ height: "32px" }}
                            value={this.state.hp}
                            onChange={TextFieldService.onChangeMethod("hp", this)}
                            onKeyDown={TextFieldService.onKeyDownMethod(this.saveCustomize, this)}
                            maxLength="6"
                        />
                    </FormGroup>
                </OptionLine>
                <OptionLine>
                    <span>Hp Bar</span>
                    <InputGroup bsSize="small" style={{ marginBottom: this.state.showColorPicker ? "300px" : "0px" }}>
                        <ColorPicker
                            showPicker={this.state.showColorPicker}
                            onTogglePicker={() => this.setState((prev) => ({ showColorPicker: !prev.showColorPicker }))}
                            color={this.state.color}
                            presetColors={C.PresetMonsterColor}
                            onChange={(c) => this.setState({ color: c.hex })}
                        />
                    </InputGroup>
                </OptionLine>
                <OptionLine>
                    <span>Text</span>
                    <InputGroup bsSize="small" style={{ marginBottom: this.state.showTextColorPicker ? "300px" : "0px" }}>
                        <ColorPicker
                            showPicker={this.state.showTextColorPicker}
                            onTogglePicker={() => this.setState((prev) => ({ showTextColorPicker: !prev.showTextColorPicker }))}
                            color={this.state.textColor}
                            presetColors={C.PresetMonsterTextColor}
                            onChange={(c) => this.setState({ textColor: c.hex })}
                        />
                    </InputGroup>
                </OptionLine>
            </ListGroup>
        );
    }

    renderCustomizeFooter() {
        return (
            <Modal.Footer>
                <Button bsSize="small" bsStyle="primary" onClick={this.saveCustomize} disabled={this.validateCustomize() !== "success"}>Save</Button>
                <Button bsSize="small" onClick={this.props.onHide}>Cancel</Button>
            </Modal.Footer>
        );
    }

    render() {
        return (
            <Modal className="Monster-options" show={this.props.show} onHide={this.props.onHide}>
                <Modal.Header closeButton>
                    <Modal.Title>{this.buildTitle()}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {this.state.showCustomize ? this.renderCustomize() : this.renderBaseOptions()}
                </Modal.Body>
                {this.state.showCustomize ? this.renderCustomizeFooter() : null}
            </Modal>
        );
    }
}

export default MonsterOptionsModal;