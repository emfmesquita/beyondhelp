import $ from "jquery";
import CharactersApp from "./CharactersApp";
import CharacterList from "./CharacterList";
import CharactersService from "./CharactersService";
import React from 'react';
import ReactDOM from 'react-dom';

/* global chrome */

class CampaignCharactersService {
    static init() {
        const path = window.location.pathname;
        if (!path.startsWith("/campaigns/")) return;

        // have private notes, is the dm of campaign
        var isDm = !!$(".ddb-campaigns-detail-body-dm-notes-private").length;

        const campaign = path.substring(11);

        chrome.runtime.sendMessage({ username: true }, {}, (username: string) => {
            if (!username) return;

            // parses and sort characters by name
            let characters = CharactersService.parseCharacters(!isDm);
            characters = characters.sort((a, b) => a.name.localeCompare(b.name));

            if (isDm) {
                // adds the container of characters folders on content page
                const jqFoldersContainer = $("<div></div>");
                $(".listing-container").append(jqFoldersContainer);

                // removes the original container of characters from content page
                $(".listing-body").detach();

                // renders the character folder structure on content page
                ReactDOM.render(<CharactersApp allCharacters={characters} owner={username} campaign={campaign} />, jqFoldersContainer[0]);
            } else {
                ReactDOM.render(<CharacterList characters={characters} />, $(".listing-body")[0]);
            }
        });
    }
}

export default CampaignCharactersService;