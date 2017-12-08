import React, { Component } from 'react';

import $ from "jquery";
import MyCharactersParseService from "./MyCharactersParseService";
import MyCharactesApp from "./MyCharactesApp";
import ReactDOM from 'react-dom';

/* global chrome */

const pathRegex = /^\/profile\/[0-9a-z]+\/characters$/i;

class MyCharactersService {
    static init() {
        const path = window.location.pathname;
        if (path !== "/my-content/characters" && !pathRegex.test(path)) return;

        chrome.runtime.sendMessage({ username: true }, {}, (username: string) => {
            if (!username) return;

            // parses and sort characters by name
            let characters = MyCharactersParseService.parseCharacters();
            characters = characters.sort((a, b) => a.name > b.name);

            // adds the container of characters folders on content page
            const jqFoldersContainer = $("<div></div>");
            $(".ddb-characters-listing-header").after(jqFoldersContainer);

            // removes the original container of characters from content page
            $(".ddb-characters-listing-body").detach();

            // renders the character folder structure on content page
            ReactDOM.render(<MyCharactesApp allCharacters={characters} owner={username} />, jqFoldersContainer[0]);
        });
    }
}

export default MyCharactersService;