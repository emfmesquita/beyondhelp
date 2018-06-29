import React, { Component } from 'react';

import $ from "jquery";
import CharacterData from "../../data/CharacterData";
import CharacterFolder from "./CharacterFolder";
import CharacterFolderData from "../../data/CharacterFolderData";
import CharacterFoldersData from "../../data/CharacterFoldersData";
import CharacterFoldersStorageService from "../../services/storage/CharacterFoldersStorageService";
import CharacterList from "./CharacterList";
import CharactersService from "./CharactersService";
import CreateFolderButton from "./CreateFolderButton";
import ReactDOM from 'react-dom';

class CharactersApp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            foldersData: null,
            charactersNotOnFolders: []
        };
    }

    componentDidMount() {

        if (!this.props.campaign) {
            // renders both of the buttons to create folders on content page
            const temp = document.createElement("div");
            ReactDOM.render(<CreateFolderButton buttonClasses="button-alt button-alt-character" onCreateFolder={this.handleCreateFolder} />, temp, () => {
                $(".page-header .more-links__links").append(temp.children[0]);
            });

            const temp2 = document.createElement("div");
            ReactDOM.render(<CreateFolderButton buttonClasses="button" onCreateFolder={this.handleCreateFolder} />, temp2, () => {
                $(".ddb-characters-listing-header-secondary").append(temp2.children[0]);
            });
        } else {
            const temp3 = document.createElement("div");
            ReactDOM.render(<CreateFolderButton buttonClasses="button-alt button-alt-default" onCreateFolder={this.handleCreateFolder} />, temp3, () => {
                $(".page-header .more-links__links").append(temp3.children[0]);
            });
        }

        // load folders from storage
        CharacterFoldersStorageService.getCharacterFolders(this.props.owner, this.props.campaign).then(this.updateState);
    }

    updateState = (foldersData: CharacterFoldersData) => {
        // calcs the characters that are not on folders
        const charactersNotOnFolders = CharactersService.charactersNotOnFolders(foldersData, this.props.allCharacters);
        this.setState({ foldersData, charactersNotOnFolders });
    }

    /**
     * Saves the current folder structure on storage.
     * @param {CharacterFoldersData} data 
     */
    saveData = (data: CharacterFoldersData) => {
        CharacterFoldersStorageService.saveCharacterFolders(data, this.props.owner, this.props.campaign).then(this.updateState);
    }

    /**
     * Called when user confirms a folder creation on modal.
     * @param {CharacterFolderData} folder 
     */
    handleCreateFolder = (folder: CharacterFolderData) => {
        const foldersData: CharacterFoldersData = this.state.foldersData || new CharacterFoldersData();
        foldersData.folders.push(folder);
        this.saveData(foldersData);
    }

    /**
     * Called when user toggles a folder, saves the state on storage.
     * @param {CharacterFolderData} folder 
     */
    handleToggle = (folder: CharacterFolderData) => {
        folder.expanded = !folder.expanded;
        this.saveData(this.state.foldersData);
    }

    /**
     * Moves a folder up/down (-1,+1), saves on storage.
     * @param {CharacterFolderData} folder 
     * @param {number} delta 
     */
    move = (folder: CharacterFolderData, delta: number) => {
        CharactersService.moveFolder(folder, delta, this.state.foldersData.folders);
        this.saveData(this.state.foldersData);
    }

    handleUp = (folder: CharacterFolderData) => {
        this.move(folder, -1);
    }

    handleDown = (folder: CharacterFolderData) => {
        this.move(folder, +1);
    }

    /**
     * Called when user confirms the deletion of a folder from dialog. Removes folder from structure and saves on storage.
     * @param {CharacterFolderData} folder 
     */
    handleDelete = (folder: CharacterFolderData) => {
        const folders: CharacterFolderData[] = this.state.foldersData.folders;
        const idx = folders.indexOf(folder);
        folders.splice(idx, 1);
        this.saveData(this.state.foldersData);
    }

    /**
     * Called when user confirms the addition of characters from modal. 
     * Adds characters on the folder, to make sure the structure is ok also removes them from other folders if any has it.
     * Saves on storage.
     * 
     * @param {CharacterFolderData} folder 
     * @param {string[]} characterIds 
     */
    handleAddCharacter = (folder: CharacterFolderData, characterIds: string[]) => {
        const folders: CharacterFolderData[] = this.state.foldersData.folders;

        characterIds.forEach(characterId => {
            folders.forEach(oldFolder => {
                const idx = oldFolder.characterIds.indexOf(characterId);
                if (idx !== -1) oldFolder.characterIds.splice(idx, 1);
            });
            folder.characterIds.push(characterId);
        });
        this.saveData(this.state.foldersData);
    }

    /**
     * Called when user confirms the removal of characters from modal. 
     * Removes the characters from the folder and saves on storage.
     * 
     * @param {CharacterFolderData} folder 
     * @param {string[]} characterIds 
     */
    handleRemoveCharacter = (folder: CharacterFolderData, characterIds: string[]) => {
        characterIds.forEach(characterId => {
            const idx = folder.characterIds.indexOf(characterId);
            if (idx !== -1) folder.characterIds.splice(idx, 1);
        });
        this.saveData(this.state.foldersData);
    }

    renderFolders = () => {
        const folders = this.state.foldersData ? this.state.foldersData.folders : [];
        return folders.map((folder, idx) => {
            let characters = this.props.allCharacters.filter(character => folder.characterIds.indexOf(character.id) !== -1);
            const up = idx !== 0;
            const down = idx !== folders.length - 1;
            return (
                <li key={folder.name}>
                    <CharacterFolder
                        data={folder}
                        characters={characters}
                        charactersNotOnFolders={this.state.charactersNotOnFolders}
                        onToggle={this.handleToggle}
                        up={up} onUp={this.handleUp}
                        down={down} onDown={this.handleDown}
                        onDelete={this.handleDelete}
                        onAddChar={this.handleAddCharacter}
                        onRemoveChar={this.handleRemoveCharacter}
                    />
                </li>
            );
        });
    }

    render() {
        return (
            <div>
                <ul className="listing listing-rpgbackground RPGBackground-listing">{this.renderFolders()}</ul>
                <div className="ddb-characters-listing-body">
                    <div className="listing-container listing-container-ul RPGCharacter-listing">
                        <div className="listing-body">
                            <CharacterList characters={this.state.charactersNotOnFolders} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default CharactersApp;