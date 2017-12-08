import React, { Component } from 'react';

import $ from "jquery";
import CharacterFolderData from "../../data/CharacterFolderData";
import ContentModal from "../dialogs/ContentModal";
import ReactDOM from 'react-dom';
import TextFieldService from "../../services/TextFieldService";

/**
 * Button to create a new folder.
 */
class CreateFolderButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newFolderModalOpened: false,
            newFolderName: ""
        };

        // adds the container to the create folder modal
        $("body").append("<div id='BH-new-folder-dialog'/>");

        this.openNewFolderModal = this.openNewFolderModal.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleConfirm = this.handleConfirm.bind(this);
    }

    componentDidUpdate(prevProps, prevState) {
        const title = "Create New Folder";
        const confirmText = "Create Folder";
        const modalContent = this.modalContent();

        // renders the modal of folder creation on content page
        const modal = <ContentModal title={title} onUpdate={() => this.nameInput && this.nameInput.focus()} content={modalContent} confirmText={confirmText} opened={this.state.newFolderModalOpened} onConfirm={this.handleConfirm} onCancel={this.handleCancel} />;
        ReactDOM.render(modal, $("#BH-new-folder-dialog")[0]);
    }

    modalContent() {
        return (
            <div className="builder-field form-input-field">
                <span className="builder-field-label">
                    <label className="builder-field-heading form-input-field-label">Folder Name</label>
                </span>
                <span className="builder-field-input">
                    <input
                        type="text"
                        className="builder-field-value"
                        maxLength="40" ref={(el) => this.nameInput = el}
                        value={this.state.newFolderName}
                        onChange={TextFieldService.onChangeMethod("newFolderName", this)}
                        onKeyDown={TextFieldService.onKeyDownMethod(this.handleConfirm, this)}
                    />
                </span>
            </div>
        );
    }

    openNewFolderModal() {
        this.setState({ newFolderModalOpened: true, newFolderName: "" });
    }

    handleCancel() {
        this.setState({ newFolderModalOpened: false });
    }

    handleConfirm() {
        if (!this.state.newFolderName || !this.state.newFolderName.trim()) return;
        this.setState({ newFolderModalOpened: false });
        const newFolder = new CharacterFolderData(new Date().getTime(), this.state.newFolderName.trim());
        this.props.onCreateFolder(newFolder);
    }

    render() {
        return (
            <a href="javascript:void(0)" className={this.props.buttonClasses} onClick={this.openNewFolderModal}>
                <span>Create a Folder</span>
            </a>
        );
    }
}

export default CreateFolderButton;