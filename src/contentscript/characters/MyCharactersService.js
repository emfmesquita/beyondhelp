import $ from "jquery";
import C from "../../Constants";
import CharactersApp from "./CharactersApp";
import CharactersService from "./CharactersService";
import MessageService from "../../services/MessageService";
import Opt from "../../Options";
import React from 'react';
import ReactDOM from 'react-dom';
import Configuration from "../../data/Configuration";

/* global chrome */

const pathRegex = /^\/profile\/[0-9a-z]+\/characters$/i;

class MyCharactersService {
    static init(config: Configuration) {
        const path = window.location.pathname;
        if (path !== "/my-content/characters" && !pathRegex.test(path)) return;

        MessageService.send(C.UsernameMessage, {}, (username: string) => {
            if (!username) return;

            // parses and sort characters by name
            let characters = CharactersService.parseCharacters();

            if (config[Opt.MyCharacterSort]) {
                characters = characters.sort((a, b) => a.name.localeCompare(b.name));
            }

            const originalListingBodies = $(".ddb-characters-listing-body .listing-body");

            if (config[Opt.MyCharactersFolders]) {
                // adds the container of characters folders on content page
                const jqFoldersContainer = $("<div></div>");
                $(".ddb-characters-listing-body .listing-header").after(jqFoldersContainer);

                // removes the original container of characters from content page
                originalListingBodies.detach();

                // renders the character folder structure on content page
                ReactDOM.render(<CharactersApp allCharacters={characters} owner={username} />, jqFoldersContainer[0]);
            } else {
                // renders only sorted characters
                ReactDOM.render(<CharacterList characters={characters} />, originalListingBodies[0]);
            }
        });
    }
}

export default MyCharactersService;