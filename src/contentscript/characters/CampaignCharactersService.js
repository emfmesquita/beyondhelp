import $ from "jquery";
import CharactersApp from "./CharactersApp";
import CharactersService from "./CharactersService";
import React from 'react';
import ReactDOM from 'react-dom';

/* global chrome */

class CampaignCharactersService {
    static init() {
        const path = window.location.pathname;
        if (!path.startsWith("/campaigns/")) return;

        const campaign = path.substring(11);

        // no private notes, it is not the dm, just returns
        if (!$(".ddb-campaigns-detail-body-dm-notes-private").length) return;

        chrome.runtime.sendMessage({ username: true }, {}, (username: string) => {
            if (!username) return;

            // parses and sort characters by name
            let characters = CharactersService.parseCharacters();
            characters = characters.sort((a, b) => a.name > b.name);

            // adds the container of characters folders on content page
            const jqFoldersContainer = $("<div></div>");
            $(".listing-container").append(jqFoldersContainer);

            // removes the original container of characters from content page
            $(".listing-body").detach();

            // renders the character folder structure on content page
            ReactDOM.render(<CharactersApp allCharacters={characters} owner={username} campaign={campaign} />, jqFoldersContainer[0]);
        });
    }
}

export default CampaignCharactersService;