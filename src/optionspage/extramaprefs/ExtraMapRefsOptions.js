import { FieldGroup, Glyphicon } from "react-bootstrap";
import React, { Component } from "react";

import BhModal from "../../modals/BhModal";
import ConfigStorageService from "../../services/storage/ConfigStorageService";
import ConfirmDialog from "../../modals/ConfirmDialog";
import DateFormat from "dateformat";
import ExtraMapRefsData from "../../data/ExtraMapRefsData";
import ExtraMapRefsErrors from "./ExtraMapRefsErrors";
import ExtraMapRefsFormArrayTemplate from "./ExtraMapRefsFormArrayTemplate";
import ExtraMapRefsSchema from "./ExtraMapRefsSchema";
import ExtraMapRefsUiSchema from "./ExtraMapRefsUiSchema";
import Form from "react-jsonschema-form";
import NewExtraMapRefsModal from "./NewExtraMapRefsModal";
import OptionButton from "../OptionButton";
import OptionGroup from "../OptionGroup";
import OptionsToolbar from "../OptionsToolbar";
import type StorageData from "../../data/StorageData";
import { debounce } from "lodash";
import sanitize from "sanitize-filename";

const fromJson = json => JSON.parse(json);
const toJson = val => JSON.stringify(val, null, 2);

const defaultName = "New Bundle";
const defaultState = (entries: ExtraMapRefsData[]) => {
    return {
        entries,
        showFailToImportModal: false,
        toDeleteEntry: null,
        toExportWithErrorsEntry: null
    };
};

class ExtraMapRefsOptions extends Component {
    constructor(props) {
        super(props);
        this.state = defaultState([]);

        this.load();
    }

    load = () => {
        return ConfigStorageService.getAllExtraMapRefs().then((entries: ExtraMapRefsData[]) => {
            entries.forEach(entry => {
                if (!entry.content.name) entry.content.name = defaultName;
            });
            this.setState(defaultState(entries));
        }).catch(error => { throw error; });
    }

    getEntry = (storageId: string): ExtraMapRefsData => {
        return this.state.entries.find(entry => entry.storageId === storageId);
    }

    handleFormChange = (entry: ExtraMapRefsData, form) => {
        entry.content = form.formData;
        entry.valid = !form.errors || form.errors.length === 0;
        this.debouncedSave(entry);
        this.setState({});
    }

    save = (entry: ExtraMapRefsData) => {
        return ConfigStorageService.saveExtraMapRefs(entry);
    }

    debouncedSave = debounce((entry: ExtraMapRefsData) => {
        return this.save(entry);
    }, 500);

    handleNew = (name: string) => {
        const newEntry = new ExtraMapRefsData(null, { name: defaultName });
        this.save(newEntry).then(() => this.load());
    }

    handleDeleteClick = (entry: ExtraMapRefsData) => {
        this.setState({ toDeleteEntry: entry });
    }

    handleDelete = () => {
        ConfigStorageService.deleteExtraMapRefs(this.state.toDeleteEntry).then(() => this.load());
    }

    handleExportClick = (entry: ExtraMapRefsData) => {
        if (entry.valid) {
            this.handleExport(entry);
        } else {
            this.setState({ toExportWithErrorsEntry: entry });
        }
    }

    handleExport = (entry: ExtraMapRefsData) => {
        chrome.downloads.download({
            url: `data:text/plain,${toJson(entry.content)}`,
            filename: `${sanitize(entry.content.name)}.json`
        });

        // closes the confirm modal
        this.setState({ toExportWithErrorsEntry: null });
    }

    handleImportClick = () => {
        this.uploadInput.click();
    }

    handleImport = (e) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];
        var reader = new FileReader();
        reader.onload = (ev) => {
            this.uploadInput.value = "";
            const text = ev.target.result;

            try {
                const content = text ? fromJson(text) : {};
                if (Array.isArray(content)) {
                    this.setState({ showFailToImportModal: true });
                    return;
                }
                if (!content.name || typeof content.name !== "string") content.name = defaultName;
                if (content.name.length > 40) content.name = content.name.substr(0, 40);
                const newEntry = new ExtraMapRefsData(null, content);
                this.save(newEntry).then(() => this.load());
            } catch (e) {
                console.error(e);
                this.setState({ showFailToImportModal: true });
            }
        };
        reader.readAsText(file);
    }

    renderForm = (entry: ExtraMapRefsData) => {
        return (
            <OptionGroup
                key={entry.storageId}
                label={(entry.content.name || defaultName).substr(0, 40)}
                deletable
                deleteTitle="Delete Extra Map Refs Bundle"
                onDelete={() => this.handleDeleteClick(entry)}
            >
                <OptionsToolbar>
                    <OptionButton icon="save" title="Export Map References Bundle" onClick={() => this.handleExportClick(entry)} />
                    <OptionButton icon="trash" title="Delete Map References Bundle" onClick={() => this.handleDeleteClick(entry)} />
                </OptionsToolbar>
                <Form
                    schema={ExtraMapRefsSchema}
                    uiSchema={ExtraMapRefsUiSchema}
                    formData={entry.content}
                    liveValidate
                    showErrorList={false}
                    transformErrors={ExtraMapRefsErrors}
                    onChange={form => this.handleFormChange(entry, form)}
                    ArrayFieldTemplate={ExtraMapRefsFormArrayTemplate}
                >
                    <div />
                </Form>
            </OptionGroup>
        );
    }

    render() {
        const valid = this.state.valid;
        return (
            <div>
                <ConfirmDialog
                    show={this.state.toDeleteEntry}
                    message="Are you sure you want to delete this bundle of map references?"
                    onCancel={() => this.setState({ toDeleteEntry: null })}
                    confirmButtonStyle="danger"
                    confirmLabel="Delete"
                    onConfirm={this.handleDelete}
                />
                <ConfirmDialog
                    show={this.state.toExportWithErrorsEntry}
                    message="This bundle has errors are you sure you want to export it?"
                    onCancel={() => this.setState({ toExportWithErrorsEntry: null })}
                    confirmButtonStyle="warning"
                    confirmLabel="Export"
                    onConfirm={() => this.handleExport(this.state.toExportWithErrorsEntry)}
                />
                <BhModal
                    show={this.state.showFailToImportModal}
                    body={<span className="BH-extramaps-fail">Failed to Import!</span>}
                    onHide={() => this.setState({ showFailToImportModal: null })}
                    addPadding
                />
                <OptionsToolbar>
                    <OptionButton icon="file" title="New Map References Bundle" onClick={this.handleNew} />
                    <OptionButton icon="open" title="Import Map References Bundle" onClick={this.handleImportClick} />
                    <input id="BH-extramaps-upload" type="file" accept=".json" ref={(el) => this.uploadInput = el} onChange={this.handleImport} />
                </OptionsToolbar>
                {this.state.entries.map(this.renderForm)}
            </div>
        );
    }
}

export default ExtraMapRefsOptions;