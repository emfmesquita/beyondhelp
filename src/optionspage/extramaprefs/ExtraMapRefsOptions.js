import React, { Component } from 'react';
import Form from "react-jsonschema-form";
import { debounce } from 'lodash';
import { Glyphicon } from 'react-bootstrap';

// DO NOT CHANGE THIS IMPORT ORDER
import AceEditor from 'react-ace';
import brace from 'brace';
import 'brace/mode/javascript';
import 'brace/theme/monokai';
// DO NOT CHANGE THIS IMPORT ORDER

import ConfigStorageService from "../../services/storage/ConfigStorageService";
import FormMapRefsData from "../../data/FormMapRefsData";
import OptionGroup from "../OptionGroup";

import ExtraMapRefsSchema from "./ExtraMapRefsSchema";
import ExtraMapRefsUiSchema from "./ExtraMapRefsUiSchema";
import ExtraMapRefsErrors from "./ExtraMapRefsErrors";
import ExtraMapRefsFormArrayTemplate from "./ExtraMapRefsFormArrayTemplate";

const noChangesMsg = "No changes.";
const hasChangesMsg = "Has changes not saved.";
const savingMsg = "Saving Changes.";
const savedMsg = "Changes Saved.";

const notValidMsg = "Invalid JSON!";
const validMsg = "Valid JSON!";

const fromJson = json => JSON.parse(json);
const toJson = val => JSON.stringify(val, null, 2);

class ExtraMapRefsOptions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            saveMsg: noChangesMsg,
            content: "",
            contentObj: {},
            loaded: false,
            valid: true
        };

        ConfigStorageService.getFormMapRefs().then((formMapRefsData: FormMapRefsData) => {
            this.handleCodeChange(formMapRefsData.content);
        });
    }

    handleCodeChange = (content: string, save: boolean) => {
        const newState = { content, loaded: true };
        if (save) newState.saveMsg = hasChangesMsg;
        try {
            newState.contentObj = content ? fromJson(content) : {};
            newState.valid = true;
        } catch (e) {
            newState.valid = false;
        }
        this.setState(newState);
        if (save) this.save(content);
    }

    handleFormChange = (form: object) => {
        const contentObj = form.formData;
        const content = toJson(contentObj);
        this.setState({ content, contentObj, valid: true });
        this.save(content);
    }

    save = debounce((content: string) => {
        this.setState({ saveMsg: savingMsg }, () => {
            ConfigStorageService.saveFormMapRefs(content).then(() => {
                this.setState({ saveMsg: savedMsg });
            });
        });
    }, 1000);

    handleEditorChange = (content: string) => {
        this.handleCodeChange(content, true);
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
                    onChange={this.handleEditorChange}
                />
            </div>
        );
    }

    render() {
        const valid = this.state.valid;
        return (
            <div>
                <OptionGroup label="JSON Editor">
                    <div><span style={{ color: valid ? "green" : "red" }}>{valid ? validMsg : notValidMsg}</span> - {this.state.saveMsg}</div>
                    {this.renderEditor()}
                </OptionGroup>
                <OptionGroup label="Form" startExpanded>
                    <Form
                        schema={ExtraMapRefsSchema}
                        uiSchema={ExtraMapRefsUiSchema}
                        formData={this.state.contentObj}
                        liveValidate
                        showErrorList={false}
                        transformErrors={ExtraMapRefsErrors}
                        onChange={this.handleFormChange}
                        ArrayFieldTemplate={ExtraMapRefsFormArrayTemplate}
                    >
                        <div />
                    </Form>
                </OptionGroup>
            </div>
        );
    }
}

export default ExtraMapRefsOptions;