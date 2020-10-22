import "./extensioncontentstyle.scss";

import $ from "jquery";
import C from "../Constants";
import CampaignCharactersService from "./characters/CampaignCharactersService";
import ConfigStorageService from "../services/storage/ConfigStorageService";
import Configuration from "../data/Configuration";
import ContentScriptService from "./ContentScriptService";
import ExtraMapRefsMode from "./maps/extrarefsmode/ExtraMapRefsMode";
import FavIconService from "./favicon/FavIconService";
import MapsService from "./maps/MapsService";
import MessageService from "../services/MessageService";
import MonstersService from "./monsters/MonstersService";
import MyCharactersService from "./characters/MyCharactersService";
import Opt from "../Options";
import PageScriptService from "../services/PageScriptService";
import PlayByPostService from "./playbypost/PlayByPostService";
import React from 'react';
import ReactDOM from 'react-dom';
import ReferencesService from "./references/ReferencesService";
import TOCService from "./tableofcontents/TOCService";
import TableRollService from "./tableroll/TableRollService";
import TinyMCEService from "./tinymce/TinyMCEService";
import TooltipsService from "./tooltips/TooltipsService";

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
    // render the add monster buttons and cr indicators
    MonstersService.init(config);

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

// listen the message of extra map refs changes
MessageService.listen(C.ExtraMapRefsChangesMessage, (message) => ConfigStorageService.getConfig().then(config => {
    // checks if was this tab that sent the message
    if (message.originalSender.tab && message.originalSender.tab.id === window.bhTabId) return;

    if (config[Opt.MapRefs]) MapsService.reload(config);
}));


ConfigStorageService.getConfig().then((config: Configuration) => {
    // discontinued
    return;

    ContentScriptService.init(config);

    init(config);

    // change fav icon of char page
    if (config[Opt.CharacterFavIcon]) FavIconService.changeCharacterFavIcon();

    // change my characters page
    if (config[Opt.MyCharactersFolders]) MyCharactersService.init(config);

    // change campaign page
    if (config[Opt.CampaignCharactersFolders]) CampaignCharactersService.init();

    // adds the Beyond Help plugin to tiny editors on page
    if (config[Opt.EditorButton] || config[Opt.FullscreenButton]) TinyMCEService.init();

    // handles errors loading tooltips 
    if (config[Opt.HomebrewTooltips]) TooltipsService.listenTooltipError();

    // intits the Table of Contents on compendium Pages
    if (config[Opt.ToC]) TOCService.init();

    // inits map references
    if (config[Opt.MapRefs]) MapsService.init(config);

    // extra map references mode
    if (config[Opt.ExtraMapRefsDrawingBundle]) ExtraMapRefsMode.init();

    // inits the refs on compendium pages
    if (config[Opt.RefButtons]) ReferencesService.init();

    // inits campaign notes textarea on pbp pages
    if (config[Opt.PbpNotes]) PlayByPostService.init();
});