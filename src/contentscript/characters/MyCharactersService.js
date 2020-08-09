import $ from "jquery";
import C from "../../Constants";
import CharacterFoldersStorageService from "../../services/storage/CharacterFoldersStorageService";
import CharacterList from "./CharacterList";
import CharactersApp from "./CharactersApp";
import CharactersService from "./CharactersService";
import Configuration from "../../data/Configuration";
import MessageService from "../../services/MessageService";
import Opt from "../../Options";
import React from 'react';
import ReactDOM from 'react-dom';
import UserService from "../../services/UserService";
import regeneratorRuntime from "regenerator-runtime";

/* global chrome */

const pathRegex = /^\/profile\/[0-9a-z]+\/characters$/i;

class MyCharactersService {
    static init(config: Configuration) {
        const path = window.location.pathname;
        if (path !== "/my-characters") return;

        const userId = UserService.getUserID();

        // hide the original container of characters
        $(".ddb-characters-listing-body .listing-body").hide();

        MessageService.send(C.UsernameMessage, {}, async (username: string) => {
            if (username) {
                await CharacterFoldersStorageService.migrateToId(username, userId);
            }
        });

        const updateCharacters = () => {
            // removes the old bh folders container
            $(".bh-characters-container").detach();

            // adds a new container of characters folders on content page
            const jqFoldersContainer = $("<div class='bh-characters-container'></div>");
            $(".ddb-characters-listing-body .listing-container").after(jqFoldersContainer);

            // empties the folder container
            jqFoldersContainer.empty();

            // parses and sort characters by name
            let characters = CharactersService.parseCharacters();

            // renders the character folder structure on content page
            ReactDOM.render(<CharactersApp allCharacters={characters} owner={userId} />, jqFoldersContainer[0]);
        }

        updateCharacters();
        MessageService.listen(C.CharactersUpdateMessage, updateCharacters);
    }
}

export default MyCharactersService;