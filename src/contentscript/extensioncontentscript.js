import "./extensioncontentstyle.scss";

import $ from "jquery";
import AddMonsterButton from './addmonsters/AddMonsterButton';
import C from "../Constants";
import CampaignCharactersService from "./characters/CampaignCharactersService";
import ConfigStorageService from "../services/storage/ConfigStorageService";
import Configuration from "../data/Configuration";
import ContentScriptService from "./ContentScriptService";
import FavIconService from "./favicon/FavIconService";
import MessageService from "../services/MessageService";
import MonsterParseData from "./addmonsters/MonsterParseData";
import MonsterParseService from "./addmonsters/MonsterParseService";
import MyCharactersService from "./characters/MyCharactersService";
import Opt from "../Options";
import PageScriptService from "../services/PageScriptService";
import React from 'react';
import ReactDOM from 'react-dom';
import ReferencesService from "./references/ReferencesService";
import TableRollService from "./tableroll/TableRollService";
import TinyMCEService from "./tinymce/TinyMCEService";
import TooltipsService from "./tooltips/TooltipsService";

const createButton = function (id: string, name: string, hp: string) {
    const buttonSpan = document.createElement("span");
    ReactDOM.render(<AddMonsterButton monsterdata={{ id, name, hp }} />, buttonSpan);
    return buttonSpan;
};

const tooltipsInit = function (config: Configuration) {
    // workaround for homebrew spell tooltips that sever removes classes
    if (config[Opt.HomebrewTooltips]) TooltipsService.homebrewSpellTooltipWorkaround();

    // inits custom tooltips (backgrounds and feats) and ref tooltips
    if (config[Opt.CustomTooltips] || config[Opt.RefTooltips]) TooltipsService.bhTooltipsInit();
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
    if (config[Opt.TableRolls]) TableRollService.init();

    tooltipsInit(config);
};

// listen a row loaded message to add monster buttons and parse tables
MessageService.listen(C.RowLoadedMessage, () => ConfigStorageService.getConfig().then(init));

// listen the message to close tinymce dialog
MessageService.listen(C.CloseTinyMessage, () => PageScriptService.run("tinymce.activeEditor.windowManager.close()"));

// listen the message to add content to tinymce
MessageService.listen(C.AddContentToTinyMessage, (message) => PageScriptService.run(`tinymce.activeEditor.insertContent(\`${message.content}\`)`));

// listen the message of comment changed
MessageService.listen(C.CommentChangedMessage, () => ConfigStorageService.getConfig().then(tooltipsInit));


ConfigStorageService.getConfig().then((config: Configuration) => {
    ContentScriptService.init(config);

    init(config);

    // change fav icon of char page
    if (config[Opt.CharacterFavIcon]) FavIconService.changeCharacterFavIcon();

    // change my characters page
    if (config[Opt.MyCharactersFolders]) MyCharactersService.init();

    // change campaign page
    if (config[Opt.CampaignCharactersFolders]) CampaignCharactersService.init();

    // adds the Beyond Help plugin to tiny editors on page
    if (config[Opt.EditorButton]) TinyMCEService.init();

    // handles errors loading tooltips 
    if (config[Opt.HomebrewTooltips]) TooltipsService.listenTooltipError();

    // inits the refs on compendium pages
    if (config[Opt.RefButtons]) ReferencesService.init();
});