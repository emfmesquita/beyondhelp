import "./extensioncontentstyle.scss";

import $ from "jquery";
import AddMonsterButton from './addmonsters/AddMonsterButton';
import C from "../Constants";
import CampaignCharactersService from "./characters/CampaignCharactersService";
import ConfigStorageService from "../services/storage/ConfigStorageService";
import Configuration from "../data/Configuration";
import ContentScriptService from "./ContentScriptService";
import FavIconService from "./favicon/FavIconService";
import MapsService from "./maps/MapsService";
import MessageService from "../services/MessageService";
import MonsterParseData from "./addmonsters/MonsterParseData";
import MonsterParseService from "./addmonsters/MonsterParseService";
import MyCharactersService from "./characters/MyCharactersService";
import Opt from "../Options";
import PageScriptService from "../services/PageScriptService";
import PlayByPostService from "./playbypost/PlayByPostService";
import React from 'react';
import ReactDOM from 'react-dom';
import ReferencesService from "./references/ReferencesService";
import TableRollService from "./tableroll/TableRollService";
import TinyMCEService from "./tinymce/TinyMCEService";
import TooltipsService from "./tooltips/TooltipsService";
import ExtraMapRefsMode from "./maps/extrarefsmode/ExtraMapRefsMode";

const createButton = function (id: string, name: string, hp: string) {
    const buttonSpan = document.createElement("span");
    ReactDOM.render(<AddMonsterButton monsterdata={{ id, name, hp }} />, buttonSpan);
    return buttonSpan;
};

const tooltipsInit = function (config: Configuration) {
    // workaround for homebrew spell tooltips that sever removes classes
    if (config[Opt.HomebrewTooltips]) TooltipsService.homebrewSpellTooltipWorkaround();

    // inits custom tooltips (backgrounds and feats) and ref tooltips
    TooltipsService.bhTooltipsInit();
};

// inits the table rollers
const tablesInit = function (config: Configuration) {
    if (config[Opt.TableRolls]) TableRollService.init();
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

    tablesInit(config);
    tooltipsInit(config);
};

// listen a row loaded message to add monster buttons and parse tables
MessageService.listen(C.RowLoadedMessage, () => ConfigStorageService.getConfig().then(init));

// listen the message of comment changed
MessageService.listen(C.CommentChangedMessage, () => ConfigStorageService.getConfig().then(config => {
    tablesInit(config);
    tooltipsInit(config);
}));


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
    if (config[Opt.EditorButton] || config[Opt.FullscreenButton]) TinyMCEService.init();

    // handles errors loading tooltips 
    if (config[Opt.HomebrewTooltips]) TooltipsService.listenTooltipError();

    // inits map references
    if (config[Opt.MapRefs]) MapsService.init(config);

    // // extra map references mode
    // if (config[Opt.ExtraMapRefsMode]) ExtraMapRefsMode.init();

    // inits the refs on compendium pages
    if (config[Opt.RefButtons]) ReferencesService.init();

    // inits campaign notes textarea on pbp pages
    if (config[Opt.PbpNotes]) PlayByPostService.init();
});