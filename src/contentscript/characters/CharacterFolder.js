import React, { Component } from 'react';

import $ from "jquery";
import CharacterData from "../../data/CharacterData";
import CharacterList from "./CharacterList";
import ContentDialog from "../dialogs/ContentDialog";
import ContentDialogService from "../dialogs/ContentDialogService";
import ContentModal from "../dialogs/ContentModal";
import ReactDOM from 'react-dom';

const addCharModalId = (folderId) => `bh-add-character-modal-${folderId}`;
const removeCharModalId = (folderId) => `bh-remove-character-modal-${folderId}`;

class CharacterFolder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mouseOver: false,
            addCharacterModalOpened: false,
            addCharacterSelected: [],
            removeCharacterModalOpened: false,
            removeCharacterSelected: []
        };

        // adds the container of the modal to add characters to folders on content page
        $("body").append(`<div id='${addCharModalId(props.data.id)}'/>`);

        // adds the container of the modal to remove characters from folders on content page
        $("body").append(`<div id='${removeCharModalId(props.data.id)}'/>`);
    }

    componentDidUpdate(prevProps, prevState) {
        // renders the modal to add characters to folders on content page
        let title = "Add Characters to this Folder";
        let confirmText = "Add";
        const filter = character => this.props.characters.indexOf(character) === -1;
        let modalContent = this.baseCharacterModalContent(this.props.charactersNotOnFolders, "addCharacterSelected");
        let modal = <ContentModal title={title} content={modalContent} confirmText={confirmText} opened={this.state.addCharacterModalOpened} onCancel={this.handleCancelAddCharacter} onConfirm={this.handleConfirmAddCharacter} />;
        ReactDOM.render(modal, $(`#${addCharModalId(this.props.data.id)}`)[0]);

        // renders the modal to remove characters from folders on content page
        title = "Remove Characters from this Folder";
        confirmText = "Remove";
        modalContent = this.baseCharacterModalContent(this.props.characters, "removeCharacterSelected");
        modal = <ContentModal title={title} content={modalContent} confirmText={confirmText} opened={this.state.removeCharacterModalOpened} onCancel={this.handleCancelRemoveCharacter} onConfirm={this.handleConfirmRemoveCharacter} />;
        ReactDOM.render(modal, $(`#${removeCharModalId(this.props.data.id)}`)[0]);
    }

    secondaryText = () => {
        const numbeOfChars = this.props.characters.length;
        return numbeOfChars === 1 ? "1 character" : `${numbeOfChars} characters`;
    }

    handleMouseIn = () => {
        this.setState({ mouseOver: true });
    }

    handleMouseOut = () => {
        this.setState({ mouseOver: false });
    }

    rowClassNames = () => {
        return `list-row list-row-background ${this.state.mouseOver || this.props.data.expanded ? "hover" : ""}`;
    }

    /**
     * Builds the content of the modals to remove/add characters from folders
     * @param {CharacterData[]} charList List of chars that are options
     * @param {string} selectProp target property of state object that should be updated with the selection
     */
    baseCharacterModalContent = (charList: CharacterData[], selectProp: string) => {
        let handleSelected = (e) => {
            const options = e.target.options;
            const value = [];
            Array.from(options).forEach(option => { if (option.selected) value.push(option.value); });
            this.setState({ [selectProp]: value });
        };
        handleSelected = handleSelected.bind(this);

        let optionName = (character: CharacterData) => {
            const label = `${character.name} (${character.race} ${character.lvl})`;
            return label.length > 52 ? label.substr(0, 49) + "..." : label;
        };
        optionName = optionName.bind(this);

        return (
            <div>
                <span className="builder-field-label">
                    <label className="builder-field-heading form-input-field-label">Characters</label>
                </span>
                <select multiple value={this.state[selectProp]} size={charList.length} className="character-select BH-character-multiple-select" onChange={handleSelected}>
                    {charList.map(character => <option key={character.id} value={character.id}>{optionName(character)}</option>)}
                </select>
            </div>
        );
    }

    /**
     * Click of add char action from folders.
     */
    addCharClick = () => {
        if (this.props.charactersNotOnFolders && this.props.charactersNotOnFolders.length === 1) {
            this.props.onAddChar(this.props.data, [this.props.charactersNotOnFolders[0].id]);
            return;
        }
        this.setState({ addCharacterModalOpened: true, addCharacterSelected: [] });
    }

    /**
     * Called when user cancels the add characters on modal.
     */
    handleCancelAddCharacter = () => {
        this.setState({ addCharacterModalOpened: false });
    }

    /**
     * Called when user confirms the add characters on modal.
     */
    handleConfirmAddCharacter = () => {
        if (!this.state.addCharacterSelected || this.state.addCharacterSelected.length === 0) return;
        this.setState({ addCharacterModalOpened: false });
        this.props.onAddChar(this.props.data, this.state.addCharacterSelected);
    }

    /**
     * Click of remove char action from folders.
     */
    RemoveCharClick = () => {
        if (this.props.characters && this.props.characters.length === 1) {
            this.props.onRemoveChar(this.props.data, [this.props.characters[0].id]);
            return;
        }
        this.setState({ removeCharacterModalOpened: true, removeCharacterSelected: [] });
    }

    /**
     * Called when user cancels the remove characters on modal.
     */
    handleCancelRemoveCharacter = () => {
        this.setState({ removeCharacterModalOpened: false });
    }

    /**
     * Called when user confirms the remove characters on modal.
     */
    handleConfirmRemoveCharacter = () => {
        if (!this.state.removeCharacterSelected || this.state.removeCharacterSelected.length === 0) return;
        this.setState({ removeCharacterModalOpened: false });
        this.props.onRemoveChar(this.props.data, this.state.removeCharacterSelected);
    }

    deleteDialogId = () => {
        return `bh-delete-folder-dialog-${this.props.data.id}`;
    }

    /**
     * Click of delete action from folders.
     */
    deleteClick = () => {
        ContentDialogService.open(this.deleteDialogId());
    }

    /**
     * Called when user confirms the delete of folder on dialog.
     */
    handleDelete = () => {
        ContentDialogService.close(this.deleteDialogId());
        this.props.onDelete(this.props.data);
    }

    renderUp = () => {
        if (!this.props.up) return null;
        return <a className="homebrew-creation-actions-item BH-homebrew-character-action" href="javascript:void(0)" onClick={() => this.props.onUp(this.props.data)}>Move Up</a>;
    }

    renderDown = () => {
        if (!this.props.down) return null;
        return <a className="homebrew-creation-actions-item BH-homebrew-character-action" href="javascript:void(0)" onClick={() => this.props.onDown(this.props.data)}>Move Down</a>;
    }

    renderRemove = () => {
        if (this.props.characters.length === 0) return null;
        return <a className="homebrew-creation-actions-item BH-homebrew-character-action" href="javascript:void(0)" onClick={this.RemoveCharClick}>Remove Characters</a>;
    }

    renderAdd = () => {
        if (this.props.charactersNotOnFolders.length === 0) return null;
        return <a className="homebrew-creation-actions-item BH-homebrew-character-action" href="javascript:void(0)" onClick={this.addCharClick}>Add Characters</a>;
    }

    render() {
        return (
            <div>
                <div className={this.rowClassNames()} onClick={() => this.props.onToggle(this.props.data)} onMouseEnter={this.handleMouseIn} onMouseLeave={this.handleMouseOut}>
                    <div className="list-row-col list-row-col-name">
                        <div className="list-row-name">
                            <div className="list-row-name-primary">
                                <div className="list-row-name-primary-text">
                                    {this.props.data.name}
                                </div>
                            </div>
                            <div className="list-row-name-secondary">
                                <div className="list-row-name-secondary-text">
                                    {this.secondaryText()}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="list-row-col list-row-col-indicator">
                        <div className={`list-row-indicator characters ${this.props.data.expanded ? "open" : "closed"}`} />
                    </div>
                </div>
                <div className="more-info more-info-background" style={{ display: this.props.data.expanded ? "block" : "none" }}>
                    <div className="homebrew-creation-actions">
                        {this.renderAdd()}
                        {this.renderRemove()}
                        {this.renderUp()}
                        {this.renderDown()}
                        <a className="homebrew-creation-actions-item homebrew-creation-actions-item-delete" href="javascript:void(0)" onClick={this.deleteClick}>Delete</a>
                    </div>
                    <div className="line character marginTop20 marginBottom20" />
                    <div className="listing-container listing-container-ul RPGCharacter-listing">
                        <div className="listing-body">
                            <CharacterList characters={this.props.characters} />
                        </div>
                    </div>
                </div>
                <div>
                    <ContentDialog message="Are you sure you wish to delete this folder?" onConfirm={this.handleDelete} dialogId={this.deleteDialogId()} />
                </div>
            </div>
        );
    }
}

export default CharacterFolder;