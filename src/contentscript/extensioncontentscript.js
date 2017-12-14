import $ from "jquery";
import AddMonsterButton from './addmonsters/AddMonsterButton';
import CampaignCharactersService from "./characters/CampaignCharactersService";
import ConfigStorageService from "../services/storage/ConfigStorageService";
import Configuration from "../data/Configuration";
import FavIconService from "./FavIconService";
import MonsterParseData from "./addmonsters/MonsterParseData";
import MonsterParseService from "./addmonsters/MonsterParseService";
import MyCharactersService from "./characters/MyCharactersService";
import React from 'react';
import ReactDOM from 'react-dom';
import TableRollService from "./tableroll/TableRollService";

const createButton = function (id: string, name: string, hp: string) {
    const buttonSpan = document.createElement("span");
    ReactDOM.render(<AddMonsterButton monsterdata={{ id, name, hp }} />, buttonSpan);
    return buttonSpan;
};

const init = function (config: Configuration) {
    // render the add monster buttons
    MonsterParseService.parseMonsters(config).forEach(data => {
        const buttonsDiv = document.createElement("div");
        const monster = data.monsterData;
        buttonsDiv.appendChild(createButton(monster.id, monster.name, monster.hp, data.insert));
        buttonsDiv.appendChild(createButton(monster.id, monster.name, monster.diceHp, data.insert));
        data.insert(buttonsDiv);
    });

    // inits the table rollers
    if (config.tableroll) TableRollService.init();
};

chrome.runtime.onMessage.addListener(() => ConfigStorageService.getConfig().then(init));

ConfigStorageService.getConfig().then((config: Configuration) => {
    init(config);

    // change fav icon of char page
    if (config.charfavicon) FavIconService.changeFavIcon();

    // change my characters page
    if (config.mycharacterfolders) MyCharactersService.init();

    // change campaign page
    if (config.campaigncharacterfolders) CampaignCharactersService.init();
});