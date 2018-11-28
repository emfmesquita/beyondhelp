import { Button, ButtonToolbar, FieldGroup, Glyphicon, Nav, Navbar } from "react-bootstrap";
import React, { Component } from "react";

import BhModal from "../../modals/BhModal";
import C from "../../Constants";
import ColorPickerWidget from "./ColorPickerWidget";
import ConfigStorageService from "../../services/storage/ConfigStorageService";
import ConfirmDialog from "../../modals/ConfirmDialog";
import DateFormat from "dateformat";
import ExtraMapRefsBundleSelectorOption from "./ExtraMapRefsBundleSelectorOption";
import ExtraMapRefsData from "../../data/ExtraMapRefsData";
import ExtraMapRefsErrors from "./ExtraMapRefsErrors";
import ExtraMapRefsFormArrayTemplate from "./ExtraMapRefsFormArrayTemplate";
import ExtraMapRefsSchema from "./ExtraMapRefsSchema";
import ExtraMapRefsStorageService from "../../services/storage/ExtraMapRefsStorageService";
import ExtraMapRefsToolbarButton from "./ExtraMapRefsToolbarButton";
import ExtraMapRefsUiSchema from "./ExtraMapRefsUiSchema";
import Form from "react-jsonschema-form";
import MessageService from "../../services/MessageService";
import NewExtraMapRefsModal from "./NewExtraMapRefsModal";
import Opt from "../../Options";
import OptionButton from "../OptionButton";
import OptionGroup from "../OptionGroup";
import OptionsToolbar from "../OptionsToolbar";
import Select from 'react-select';
import SelectUtils from "../../forms/SelectUtils";
import { debounce } from "lodash";
import sanitize from "sanitize-filename";

import type StorageData from "../../data/StorageData";

const defaultNameRegex = /New Bundle [0-9]+/;

// on some cases during value change of select onChange of form is fired
// added a workaround to skip unwanted saves
let skipFormChangeWorkaround = false;

const fromJson = json => JSON.parse(json);
const toJson = val => JSON.stringify(val, null, 2);

const sendChangedMessage = () => {
    MessageService.send(C.ExtraMapRefsChangesMessage);
};

class ExtraMapRefsOptions extends Component {
    constructor(props) {
        super(props);
        this.state = this.defaultState({ bundles: [] });
        this.load({ firstLoad: true });

        MessageService.listen(C.ExtraMapRefsChangesMessage, () => {
            this.load();
        });
    }

    nextDefaultName = () => {
        let last = 0;
        const bundles = this.state.bundles;
        bundles && bundles.forEach(bundle => {
            if (!bundle.content || !bundle.content.name || !defaultNameRegex.test(bundle.content.name)) return;
            const number = Number.parseInt(bundle.content.name.substr(11));
            if (number >= last) last = number;
        });
        return `New Bundle ${last + 1}`;
    }

    defaultState = ({ bundles, newBundle, deleted, firstLoad } = {}) => {
        const state = {
            bundles,
            showFailToImportModal: false,
            toDeleteBundle: null,
            toExportWithErrorsBundle: null
        };

        // if a bundle was created sets the selected option of state
        if (newBundle) state.selectedBundle = newBundle;
        // if a bundle was deleted sets null on selected option of state
        else if (deleted) state.selectedBundle = bundles[bundles.length - 1];
        // if it is the first load sets the current drawing bundle as selected
        else if (firstLoad) {
            const drawingBundle = bundles.find(this.isDrawing);
            if (drawingBundle) state.selectedBundle = drawingBundle;
        }

        return state;
    }

    load = ({ deleted, newBundle, firstLoad } = {}) => {
        return ExtraMapRefsStorageService.getAll().then((bundles: ExtraMapRefsData[]) => {
            bundles.forEach(bundle => {
                if (!bundle.content.name) bundle.content.name = this.nextDefaultName();
            });

            // if there is a new bundle searches it on the list from storage
            // making sure the selected bundle and the one on list are the same object
            if (newBundle) newBundle = bundles.find(bundle => bundle.storageId === newBundle.storageId);

            const state = this.defaultState({ bundles, newBundle, deleted, firstLoad });

            // makes sure that the current selected bundle is from the list of loaded bundles
            // fixes a bug of editing on compendium page triggering an option reload
            if (this.state.selectedBundle && !newBundle && !deleted) {
                state.selectedBundle = bundles.find(bundle => bundle.storageId === this.state.selectedBundle.storageId);
            }

            this.setState(state);
        }).catch(error => { throw error; });
    }

    handleFormChange = (bundle: ExtraMapRefsData, form) => {
        if (skipFormChangeWorkaround) return;
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

    isDrawing = (bundle: ExtraMapRefsData): boolean => {
        return bundle && bundle.storageId === this.props.config[Opt.ExtraMapRefsDrawingBundle];
    }

    isHidden = (bundle: ExtraMapRefsData): boolean => {
        return bundle && bundle.hidden;
    }

    handleNew = (name: string) => {
        const newBundle = new ExtraMapRefsData(null, { name: this.nextDefaultName() });
        this.save(newBundle).then(() => this.load({ newBundle }));
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
            this.load({ deleted: true });
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
            filename: `${sanitize(bundle.content.name.substr(0, 40))}.json`
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
                if (!content.name || typeof content.name !== "string") content.name = this.nextDefaultName();
                if (content.name.length > 40) content.name = content.name.substr(0, 40);
                const newBundle = new ExtraMapRefsData(null, content);
                this.save(newBundle).then(() => this.load({ newBundle }));
            } catch (e) {
                console.error(e);
                this.setState({ showFailToImportModal: true });
            }
        };
        reader.readAsText(file);
    }

    handleHide = (bundle: ExtraMapRefsData, hidden: boolean) => {
        bundle.hidden = hidden;
        if (hidden && this.isDrawing(bundle)) {
            // if is hiding and was the drawing bundle needs to stop being the drawing bundle
            this.save(bundle).then(() => this.props.onDrawingBundleChange(""));
            return;
        }
        this.save(bundle).then(() => this.load());
    }

    handleDrawing = (bundle: ExtraMapRefsData, drawing: boolean) => {
        const newDrawingStorageId = drawing ? bundle.storageId : "";
        if (drawing && bundle.hidden) {
            // if was hidden and should be drawing now needs to stop being hidden
            bundle.hidden = false;
            this.save(bundle).then(() => this.props.onDrawingBundleChange(newDrawingStorageId));
        } else {
            this.props.onDrawingBundleChange(newDrawingStorageId);
        }
    }

    renderDrawingButton = (bundle: ExtraMapRefsData) => {
        if (this.isDrawing(bundle)) return <ExtraMapRefsToolbarButton label="Draw" icon="pencil" title="Stop Drawing on this Bundle" active onClick={() => this.handleDrawing(bundle, false)} />;
        return <ExtraMapRefsToolbarButton label="Draw" icon="pencil" title="Start Drawing on this Bundle" disabled={!bundle} onClick={() => this.handleDrawing(bundle, true)} />;
    }

    renderHideButton = (bundle: ExtraMapRefsData) => {
        if (this.isHidden(bundle)) return <ExtraMapRefsToolbarButton label="Hide" icon="eye-close" title="Unhide Map Refs Bundle" active onClick={() => this.handleHide(bundle, false)} />;
        return <ExtraMapRefsToolbarButton label="Hide" icon="eye-close" title="Hide Map Refs Bundle" disabled={!bundle} onClick={() => this.handleHide(bundle, true)} />;
    }

    renderBundle = (bundle: ExtraMapRefsData) => {
        if (!bundle) return <div>No bundle of map references is selected.</div>;
        return (
            <div>
                <Form
                    key={bundle.storageId}
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
            </div>
        );
    }

    renderToolbar = (bundle: ExtraMapRefsData) => {
        let selectClassName = "BH-extramaps-bundle-select";
        if (this.isDrawing(bundle)) selectClassName += " BH-bundle-drawing";
        else if (this.isHidden(bundle)) selectClassName += " BH-bundle-hidden";

        return (
            <Navbar fluid>
                <Nav className="BH-extramaps-nav">
                    <Select
                        className={selectClassName}
                        classNamePrefix="BH-extramaps-bundle-select"
                        getOptionLabel={(bundle) => bundle.content.name}
                        getOptionValue={(bundle) => bundle.storageId}
                        placeholder="Select a bundle..."
                        noOptionsMessage={() => "No bundles found"}
                        isClearable={false}
                        isSearchable={false}
                        blurInputOnSelect
                        config={this.props.config}
                        components={{ Option: ExtraMapRefsBundleSelectorOption }}
                        theme={SelectUtils.defaultTheme()}
                        styles={SelectUtils.defaultStyle({})}
                        value={this.state.selectedBundle}
                        options={this.state.bundles}
                        onChange={(bundle) => {
                            // on some cases during value change of select
                            // onChange of form is fired
                            // added a workaround to skip unwanted saves
                            this.setState({ selectedBundle: bundle }, () => {
                                skipFormChangeWorkaround = false;
                            });
                            skipFormChangeWorkaround = true;
                        }}
                    />
                    <ExtraMapRefsToolbarButton label="New" icon="file" title="New Map References Bundle" onClick={this.handleNew} />
                    <ExtraMapRefsToolbarButton label="Import" icon="open" title="Import Map References Bundle" onClick={this.handleImportClick} />
                    <input id="BH-extramaps-upload" type="file" accept=".json" ref={(el) => this.uploadInput = el} onChange={this.handleImport} />
                    <ExtraMapRefsToolbarButton label="Export" icon="save" title="Export Map References Bundle" disabled={!bundle} onClick={() => this.handleExportClick(bundle)} />
                    <ExtraMapRefsToolbarButton label="Delete" icon="trash" title="Delete Map References Bundle" disabled={!bundle} onClick={() => this.handleDeleteClick(bundle)} />
                    {this.renderDrawingButton(bundle)}
                    {this.renderHideButton(bundle)}
                </Nav>
            </Navbar>
        );
    }

    render() {
        const valid = this.state.valid;
        const bundle = this.state.selectedBundle;
        const currentBundleName = bundle ? bundle.content.name : "";
        return (
            <div>
                <ConfirmDialog
                    show={this.state.toDeleteBundle}
                    message={`Are you sure you want to delete the bundle "${currentBundleName}"`}
                    onCancel={() => this.setState({ toDeleteBundle: null })}
                    confirmButtonStyle="danger"
                    confirmLabel="Delete"
                    onConfirm={this.handleDelete}
                />
                <ConfirmDialog
                    show={this.state.toExportWithErrorsBundle}
                    message={`The bundle "${currentBundleName}" has errors are you sure you want to export it?`}
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
                {this.renderToolbar(bundle)}
                {this.renderBundle(bundle)}
            </div>
        );
    }
}

export default ExtraMapRefsOptions;