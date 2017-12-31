import "./OptionsApp.scss";

import { Form, ListGroup } from 'react-bootstrap';
import React, { Component } from 'react';

import C from "../Constants";
import CheckBoxField from "../forms/CheckBoxField";
import ConfigStorageService from "../services/storage/ConfigStorageService";
import Configuration from "../data/Configuration";
import FieldService from "../services/FieldService";
import Opt from "../Options";
import OptionLine from "../forms/OptionLine";
import StorageService from "../services/storage/StorageService";

class OptionsApp extends Component {

    constructor(props) {
        super(props);

        this.state = {};
        Opt.AllOptions.forEach(opt => this.state[opt] = false);

        this.init();
    }

    init = () => {
        ConfigStorageService.getConfig().then((config: Configuration) => {
            const newState = {};
            Opt.AllOptions.forEach(opt => newState[opt] = config[opt]);
            this.setState(newState);
        });
    }

    updateConfig = () => {
        ConfigStorageService.getConfig().then((config: Configuration) => {
            Opt.AllOptions.forEach(opt => config[opt] = this.state[opt]);
            return StorageService.updateData(config);
        });
    }

    changeOptionHandler = (prop: string) => {
        const baseChangeFunc = FieldService.onToggleFunc(prop, this);
        return (e) => {
            baseChangeFunc(e);
            this.updateConfig();
        };
    }

    optionField = (label: string, option: string) => {
        return <CheckBoxField checkText={label} value={this.state[option]} onChange={this.changeOptionHandler(option)} />;
    }

    render() {
        return (
            <Form>
                {this.optionField("Show buttons to add monsters on monsters listing pages.", Opt.AddMonsterOnList)}
                {this.optionField("Show buttons to add monsters on monsters details pages.", Opt.AddMonsterOnDetail)}
                {this.optionField("Show buttons to add monsters on homebrew pages.", Opt.AddMonsterOnHomebrewList)}
                {this.optionField("Enable roll on tables.", Opt.TableRolls)}
                {this.optionField("Change character pages favicon.", Opt.CharacterFavIcon)}
                {this.optionField("Enable folders and sort on 'My Characters' page.", Opt.MyCharactersFolders)}
                {this.optionField("Enable folders and sort on campaign pages.", Opt.CampaignCharactersFolders)}
                {this.optionField("Enable Beyond Help button on editors.", Opt.EditorButton)}
                {this.optionField("Enable Homebrew Tooltips extra handling (style and errors).", Opt.HomebrewTooltips)}
            </Form>
        );
    }
}

export default OptionsApp;