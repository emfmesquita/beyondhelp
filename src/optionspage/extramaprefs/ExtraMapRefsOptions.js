import { FieldGroup, Glyphicon } from "react-bootstrap";
import React, { Component } from "react";

import BhModal from "../../modals/BhModal";
import C from "../../Constants";
import ColorPickerWidget from "./ColorPickerWidget";
import ConfigStorageService from "../../services/storage/ConfigStorageService";
import ConfirmDialog from "../../modals/ConfirmDialog";
import DateFormat from "dateformat";
import ExtraMapRefsData from "../../data/ExtraMapRefsData";
import ExtraMapRefsErrors from "./ExtraMapRefsErrors";
import ExtraMapRefsFormArrayTemplate from "./ExtraMapRefsFormArrayTemplate";
import ExtraMapRefsSchema from "./ExtraMapRefsSchema";
import ExtraMapRefsStorageService from "../../services/storage/ExtraMapRefsStorageService";
import ExtraMapRefsUiSchema from "./ExtraMapRefsUiSchema";
import Form from "react-jsonschema-form";
import MessageService from "../../services/MessageService";
import NewExtraMapRefsModal from "./NewExtraMapRefsModal";
import Opt from "../../Options";
import OptionButton from "../OptionButton";
import OptionGroup from "../OptionGroup";
import OptionsToolbar from "../OptionsToolbar";
import { debounce } from "lodash";
import sanitize from "sanitize-filename";

import type StorageData from "../../data/StorageData";

const fromJson = json => JSON.parse(json);
const toJson = val => JSON.stringify(val, null, 2);

const defaultName = "New Bundle";
const defaultState = (bundles: ExtraMapRefsData[]) => {
    return {
        bundles,
        showFailToImportModal: false,
        toDeleteBundle: null,
        toExportWithErrorsBundle: null
    };
};

const sendChangedMessage = () => {
    MessageService.send(C.ExtraMapRefsChangesMessage);
};

class ExtraMapRefsOptions extends Component {
    constructor(props) {
        super(props);
        this.state = defaultState([]);
        this.load();

        MessageService.listen(C.ExtraMapRefsChangesMessage, () => {
            this.load();
        });
    }

    load = () => {
        return ExtraMapRefsStorageService.getAll().then((bundles: ExtraMapRefsData[]) => {
            bundles.forEach(bundle => {
                if (!bundle.content.name) bundle.content.name = defaultName;
            });
            this.setState(defaultState(bundles));
        }).catch(error => { throw error; });
    }

    handleFormChange = (bundle: ExtraMapRefsData, form) => {
        bundle.content = form.formData;
        bundle.valid = !form.errors || form.errors.length === 0;
        this.debouncedSave(bundle);
        this.setState({});
    }

    save = (bundle: ExtraMapRefsData) => {
        return ExtraMapRefsStorageService.save(bundle).then(() => {
            MessageService.send(C.ExtraMapRefsChangesMessage);
        });
    }

    debouncedSave = debounce((bundle: ExtraMapRefsData) => {
        return this.save(bundle);
    }, 500);

    isDrawing = (bundle: ExtraMapRefsData) => {
        return bundle.storageId === this.props.config[Opt.ExtraMapRefsDrawingBundle];
    }

    buildBundleLabel = (bundle: ExtraMapRefsData) => {
        const name = (bundle.content.name || defaultName).substr(0, 40);
        if (!this.isDrawing(bundle)) return name;
        return `${name} (Drawing)`;
    }

    handleNew = (name: string) => {
        const newBundle = new ExtraMapRefsData(null, { name: defaultName });
        this.save(newBundle).then(() => this.load());
    }

    handleDeleteClick = (bundle: ExtraMapRefsData) => {
        this.setState({ toDeleteBundle: bundle });
    }

    handleDelete = () => {
        ExtraMapRefsStorageService.delete(this.state.toDeleteBundle).then(() => {
            // checks if the deleted bundle was the draing one
            // if so the new drawing bundle id goes to empty
            // if not it continues the same
            // no matter what the change goes up to reload compendium pages (soft or hard depending the case)
            const drawingBundleId = this.props.config[Opt.ExtraMapRefsDrawingBundle];
            const newDrawingBundleId = this.isDrawing(this.state.toDeleteBundle) ? "" : drawingBundleId;
            this.props.onDrawingBundleChange(newDrawingBundleId);
            this.load();
        });
    }

    handleExportClick = (bundle: ExtraMapRefsData) => {
        if (bundle.valid) {
            this.handleExport(bundle);
        } else {
            this.setState({ toExportWithErrorsBundle: bundle });
        }
    }

    handleExport = (bundle: ExtraMapRefsData) => {
        chrome.downloads.download({
            url: `data:text/plain,${toJson(bundle.content)}`,
            filename: `${sanitize(bundle.content.name)}.json`
        });

        // closes the confirm modal
        this.setState({ toExportWithErrorsBundle: null });
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
                const newBundle = new ExtraMapRefsData(null, content);
                this.save(newBundle).then(() => this.load());
            } catch (e) {
                console.error(e);
                this.setState({ showFailToImportModal: true });
            }
        };
        reader.readAsText(file);
    }

    renderDrawingButton = (bundle: ExtraMapRefsData) => {
        if (this.isDrawing(bundle)) return <OptionButton icon="ok" title="Finish Drawing" onClick={() => this.props.onDrawingBundleChange("")} />;
        return <OptionButton icon="pencil" title="Start Drawing" onClick={() => this.props.onDrawingBundleChange(bundle.storageId)} />;
    }

    renderForm = (bundle: ExtraMapRefsData) => {
        return (
            <OptionGroup
                key={bundle.storageId}
                label={this.buildBundleLabel(bundle)}
                startExpanded={this.isDrawing(bundle)}
                deleteTitle="Delete Extra Map Refs Bundle"
                onDelete={() => this.handleDeleteClick(bundle)}
            >
                <OptionsToolbar>
                    <OptionButton icon="save" title="Export Map References Bundle" onClick={() => this.handleExportClick(bundle)} />
                    <OptionButton icon="trash" title="Delete Map References Bundle" onClick={() => this.handleDeleteClick(bundle)} />
                    {this.renderDrawingButton(bundle)}
                </OptionsToolbar>
                <Form
                    schema={ExtraMapRefsSchema}
                    uiSchema={ExtraMapRefsUiSchema}
                    formData={bundle.content}
                    liveValidate
                    showErrorList={false}
                    transformErrors={ExtraMapRefsErrors}
                    onChange={form => this.handleFormChange(bundle, form)}
                    ArrayFieldTemplate={ExtraMapRefsFormArrayTemplate}
                    widgets={{
                        colorPicker: ColorPickerWidget
                    }}
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
                    show={this.state.toDeleteBundle}
                    message="Are you sure you want to delete this bundle of map references?"
                    onCancel={() => this.setState({ toDeleteBundle: null })}
                    confirmButtonStyle="danger"
                    confirmLabel="Delete"
                    onConfirm={this.handleDelete}
                />
                <ConfirmDialog
                    show={this.state.toExportWithErrorsBundle}
                    message="This bundle has errors are you sure you want to export it?"
                    onCancel={() => this.setState({ toExportWithErrorsBundle: null })}
                    confirmButtonStyle="warning"
                    confirmLabel="Export"
                    onConfirm={() => this.handleExport(this.state.toExportWithErrorsBundle)}
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
                {this.state.bundles.map(this.renderForm)}
            </div>
        );
    }
}

export default ExtraMapRefsOptions;