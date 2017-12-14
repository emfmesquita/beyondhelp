import "./OptionsApp.scss";

import { Form, ListGroup } from 'react-bootstrap';
import React, { Component } from 'react';

import CheckBoxField from "../forms/CheckBoxField";
import ConfigStorageService from "../services/storage/ConfigStorageService";
import Configuration from "../data/Configuration";
import FieldService from "../services/FieldService";
import OptionLine from "../forms/OptionLine";
import StorageService from "../services/storage/StorageService";

class OptionsApp extends Component {

    constructor(props) {
        super(props);
        this.state = {
            addmonsteronlist: false,
            addmonsteronhlist: false,
            addmonsterondetail: false,
            tableroll: false,
            charfavicon: false,
            mycharacterfolders: false,
            campaigncharacterfolders: false
        };
        this.init();
    }

    init = () => {
        ConfigStorageService.getConfig().then((config: Configuration) => {
            const addmonsteronlist = config.addmonsteronlist;
            const addmonsteronhlist = config.addmonsteronhlist;
            const addmonsterondetail = config.addmonsterondetail;
            const tableroll = config.tableroll;
            const charfavicon = config.charfavicon;
            const mycharacterfolders = config.mycharacterfolders;
            const campaigncharacterfolders = config.campaigncharacterfolders;
            this.setState({ addmonsteronlist, addmonsteronhlist, addmonsterondetail, tableroll, charfavicon, mycharacterfolders, campaigncharacterfolders });
        });
    }

    updateConfig = () => {
        ConfigStorageService.getConfig().then((config: Configuration) => {
            config.addmonsteronlist = this.state.addmonsteronlist;
            config.addmonsteronhlist = this.state.addmonsteronhlist;
            config.addmonsterondetail = this.state.addmonsterondetail;
            config.tableroll = this.state.tableroll;
            config.charfavicon = this.state.charfavicon;
            config.mycharacterfolders = this.state.mycharacterfolders;
            config.campaigncharacterfolders = this.state.campaigncharacterfolders;
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

    render() {
        return (
            <Form>
                <CheckBoxField
                    checkText="Show buttons to add monsters on monsters listing pages."
                    value={this.state.addmonsteronlist}
                    onChange={this.changeOptionHandler("addmonsteronlist")}
                />
                <CheckBoxField
                    checkText="Show buttons to add monsters on monsters details pages."
                    value={this.state.addmonsterondetail}
                    onChange={this.changeOptionHandler("addmonsterondetail")}
                />
                <CheckBoxField
                    checkText="Show buttons to add monsters on homebrew pages."
                    value={this.state.addmonsteronhlist}
                    onChange={this.changeOptionHandler("addmonsteronhlist")}
                />
                <CheckBoxField
                    checkText="Enable roll on tables."
                    value={this.state.tableroll}
                    onChange={this.changeOptionHandler("tableroll")}
                />
                <CheckBoxField
                    checkText="Change character pages favicon."
                    value={this.state.charfavicon}
                    onChange={this.changeOptionHandler("charfavicon")}
                />
                <CheckBoxField
                    checkText="Enable folders and sort on 'My Characters' page."
                    value={this.state.mycharacterfolders}
                    onChange={this.changeOptionHandler("mycharacterfolders")}
                />
                <CheckBoxField
                    checkText="Enable folders and sort on campaign pages."
                    value={this.state.campaigncharacterfolders}
                    onChange={this.changeOptionHandler("campaigncharacterfolders")}
                />
            </Form>
        );
    }
}

export default OptionsApp;