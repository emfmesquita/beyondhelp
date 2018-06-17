import "./MapTooltipForm.scss";

import React, { Component } from 'react';

import MenuButton from "../buttons/MenuButton";
import { debounce } from 'lodash';
import ConfigStorageService from "../services/storage/ConfigStorageService";
import FormMapRefsData from "../data/FormMapRefsData";

// DO NOT CHANGE THIS IMPORT ORDER
import AceEditor from 'react-ace';
import brace from 'brace';
import 'brace/mode/javascript';
import 'brace/theme/monokai';
// DO NOT CHANGE THIS IMPORT ORDER

const noChangesMsg = "No changes.";
const hasChangesMsg = "Has changes not saved.";
const savingMsg = "Saving Changes.";
const savedMsg = "Changes Saved.";

class MapTooltipForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            saveMsg: noChangesMsg,
            content: "",
            loaded: false
        };

        ConfigStorageService.getFormMapRefs().then((formMapRefsData: FormMapRefsData) => {
            this.setState({ content: formMapRefsData.content, loaded: true });
        });
    }

    save = debounce((content: string) => {
        this.setState({ saveMsg: savingMsg }, () => {
            ConfigStorageService.saveFormMapRefs(content).then(() => {
                this.setState({ saveMsg: savedMsg });
            });
        });
    }, 1000);

    handleChange = (content: string) => {
        this.setState({ saveMsg: hasChangesMsg, content });
        this.save(content);
    }

    renderEditor = () => {
        if (!this.state.loaded) return null;
        return (
            <div>
                <AceEditor
                    mode="javascript"
                    theme="monokai"
                    name="BH-option-mapref-editor"
                    value={this.state.content}
                    wrapEnabled
                    focus
                    width="100%"
                    height="300px"
                    showPrintMargin={false}
                    tabSize={2}
                    setOptions={{
                        useWorker: false
                    }}
                    onChange={this.handleChange}
                />
                <textarea className="BH-option-mapref-width-hack" />
            </div>
        );
    }

    render() {
        return (
            <div>
                <div>{this.state.saveMsg}</div>
                {this.renderEditor()}
            </div>
        );
    }
}

export default MapTooltipForm;