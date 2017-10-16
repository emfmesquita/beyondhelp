import React, { Component } from 'react';
import { FormControl, FormGroup, InputGroup } from 'react-bootstrap';
import './MonsterHpBarForm.css';
import MonsterMenuButton from "./monsterbuttons/MonsterMenuButton";

class MonsterHpBarForm extends Component {
    constructor(props) {
        super(props);
        this.state = { value: this.props.currentHp + "" }
        this.inputRendered = this.inputRendered.bind(this);
        this.validate = this.validate.bind(this);
        this.changeValue = this.changeValue.bind(this);
        this.okClick = this.okClick.bind(this);
        this.keyDown = this.keyDown.bind(this);
    }

    inputRendered(input: HTMLInputElement) {
        if (input) {
            input.focus();
            input.setSelectionRange(0, this.state.value.length);
        }
    }

    validate() {
        return isNaN(this.state.value) ? "error" : "success";
    }

    /**
     * onChange of hp field value
     */
    changeValue(e) {
        this.setState({ value: e.target.value });
    }

    /**
     * onClick of ok button
     */
    okClick() {
        if (this.validate() === "error") return;
        this.props.onHpChange(Number(this.state.value));
    }

    /**
     * onKeyDown inside when input focused
     */
    keyDown(e: KeyboardEvent) {
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
                        <MonsterMenuButton icon="glyphicon-remove" onClick={this.props.onCancel} title="Cancel" />
                        <MonsterMenuButton icon="glyphicon-ok" onClick={this.okClick} title="Change Hp" />
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