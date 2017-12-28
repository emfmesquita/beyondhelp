import $ from "jquery";
import C from "../../Constants";
import CharacterList from "./CharacterList";
import CharactersApp from "./CharactersApp";
import CharactersService from "./CharactersService";
import MessageService from "../../services/MessageService";
import React from 'react';
import ReactDOM from 'react-dom';

/* global chrome */

class CampaignCharactersService {
    static init() {
        const path = window.location.pathname;
        if (!path.startsWith("/campaigns/") || path.startsWith("/campaigns/join/")) return;

        // have private notes, is the dm of campaign
        var isDm = !!$(".ddb-campaigns-detail-body-dm-notes-private").length;

        const campaign = path.substring(11);

        MessageService.send(C.UsernameMessage, {}, (username: string) => {
            if (!username) return;

            const charListContainers = $(".listing-container");
            const hasDeactivatedList = charListContainers.length > 1;
            const originalListingBodies = $(".listing-body");

            // parses and sort characters by name
            let characters = CharactersService.parseCharacters(!isDm, charListContainers[0]);
            characters = characters.sort((a, b) => a.name.localeCompare(b.name));

            if (isDm) {
                // adds the container of characters folders on content page
                const jqFoldersContainer = $("<div></div>");
                $(".listing-container").first().append(jqFoldersContainer);

                // removes the original container of characters from content page
                originalListingBodies.first().detach();

                // renders the character folder structure on content page
                ReactDOM.render(<CharactersApp allCharacters={characters} owner={username} campaign={campaign} />, jqFoldersContainer[0]);
            } else {
                ReactDOM.render(<CharacterList characters={characters} />, originalListingBodies[0]);
            }

            if (hasDeactivatedList) {
                characters = CharactersService.parseCharacters(!isDm, charListContainers[1]);
                characters = characters.sort((a, b) => a.name.localeCompare(b.name));
                ReactDOM.render(<CharacterList characters={characters} />, originalListingBodies[1]);
            }
        });
    }
}

export default CampaignCharactersService;