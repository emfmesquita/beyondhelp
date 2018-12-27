import './MonsterHpBarForm.css';

import { FormControl, FormGroup, InputGroup } from 'react-bootstrap';
import React, { Component } from 'react';

import MenuButton from "./buttons/MenuButton";

const hpRegex = /^[-+]?[0-9]{1,10}$/i

class MonsterHpBarForm extends Component {
    constructor(props) {
        super(props);
        this.state = { value: this.props.currentHp + "" };
    }

    inputRendered = (input: HTMLInputElement) => {
        if (input) {
            input.focus();
            input.setSelectionRange(0, this.state.value.length);
        }
    }

    validate = () => {
        return hpRegex.test(this.state.value) ? "success" : "error";
    }

    /**
     * onChange of hp field value
     */
    changeValue = (e) => {
        this.setState({ value: e.target.value });
    }

    /**
     * onClick of ok button
     */
    okClick = (e: MouseEvent) => {
        if (e) e.preventDefault();
        if (e) e.stopPropagation();
        if (this.validate() === "error") return;
        const strValue = this.state.value;
        let value = this.props.currentHp;
        if (strValue.startsWith("+")) {
            value += Number.parseInt(strValue.substr(1));
        } else if (strValue.startsWith("-")) {
            value -= Number.parseInt(strValue.substr(1));
        } else {
            value = Number.parseInt(strValue);
        }
        this.props.onHpChange(value);
    }

    /**
     * onKeyDown inside when input focused
     */
    keyDown = (e: KeyboardEvent) => {
        if (e.which === 13 || e.keyCode === 13) {
            this.okClick();
            return;
        }
        if (e.which === 27 || e.keyCode === 27) {
            e.preventDefault();
            e.stopPropagation();
            this.props.onCancel();
            return;
        }
    }

    render() {
        return (
            <FormGroup validationState={this.validate()} onBlur={this.props.onCancel}>
                <InputGroup bsSize="small">
                    <InputGroup.Addon>
                        <MenuButton icon="glyphicon-remove" onClick={this.props.onCancel} title="Cancel" />
                        <MenuButton icon="glyphicon-ok" onClick={this.okClick} title="Change Hp" />
                    </InputGroup.Addon>
                    <FormControl type="text" value={this.state.value} onChange={this.changeValue} onKeyDown={this.keyDown} inputRef={this.inputRendered} />
                    <InputGroup.Addon>
                        <span className="Monster-hp-bar-form-max-hp">{this.props.maxHp}</span>
                    </InputGroup.Addon>
                </InputGroup>
            </FormGroup>
        );
    }
}

export default MonsterHpBarForm;