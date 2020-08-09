import BadgeService from "../services/BadgeService";
import C from "../Constants";
import ConfigStorageService from "../services/storage/ConfigStorageService";
import LinkService from "../services/LinkService";
import MessageService from "../services/MessageService";
import NotificationService from "../services/NotificationService";
import Opt from "../Options";
import SyncStorageService from "../services/storage/SyncStorageService";
import TooltipsService from "../contentscript/tooltips/TooltipsService";
import UserService from "../services/UserService";
import packageJson from "../../package.json";

/* global chrome */

// runs code for each version a single time'
chrome.runtime.onInstalled.addListener(() => {
    ConfigStorageService.getConfig().then((config: Configuration) => {
        const changelog: string[] = config[Opt.Changelog] || [];
        const runOnce = (version: string, toRun: Function) => {
            if (changelog.indexOf(version) === -1) {
                changelog.push(version);
                toRun();
            }
        }

        runOnce("0.15.0", () => config[Opt.ToC] = true);
        runOnce("0.16.0", () => config[Opt.MyCharacterSort] = config[Opt.MyCharactersFolders]);

        config[Opt.Changelog] = changelog;
        SyncStorageService.updateData(config);
    });
});

// listen the dndbeyound request to gather a more info
// sends a message to the content script to render the add monster buttons and parse roll tables
chrome.webRequest.onCompleted.addListener((details) => details.tabId >= 0 && MessageService.sendToTab(details.tabId, C.RowLoadedMessage), {
    urls: [
        "*://*.dndbeyond.com/magic-items/*/more-info",
        "*://*.dndbeyond.com/monsters/*/more-info",
        "*://*.dndbeyond.com/spells/*/more-info",
        "*://*.dndbeyond.com/characters/backgrounds/*/more-info",
        "*://*.dndbeyond.com/characters/feats/*/more-info"
    ]
});

// listen tooltip request errors
// sends a message to the content script to handle it
chrome.webRequest.onErrorOccurred.addListener((details) => details.tabId >= 0 && MessageService.sendToTab(details.tabId, C.TooltipErrorMessage, details), {
    urls: [
        "*://*.dndbeyond.com/magic-items/*/tooltip*",
        "*://*.dndbeyond.com/monsters/*/tooltip*",
        "*://*.dndbeyond.com/spells/*/tooltip*"
    ]
});

// listen comment created, edited, deleted, undeleted
// sends a message to the content script to handle it - basically to init tooltips on it
chrome.webRequest.onCompleted.addListener((details) => details.tabId >= 0 && MessageService.sendToTab(details.tabId, C.CommentChangedMessage), {
    urls: [
        "*://*.dndbeyond.com/comments/*"
    ]
});

// listen comment created, edited, deleted, undeleted
// sends a message to the content script to handle it - basically to init tooltips on it
chrome.webRequest.onCompleted.addListener((details) => details.tabId >= 0 && MessageService.sendToTab(details.tabId, C.CharactersUpdateMessage), {
    urls: [
        "*://character-service.dndbeyond.com/character/*"
    ]
});

// listen when a monster is added from AddMonsterButton, adds a notification
MessageService.listen(C.AddMonsterMessage, (message) => {
    if (message.addNotificationMessage) {
        NotificationService.createNotification(message.notificationid, message.notification);
    }
    BadgeService.updateBadgeCount();
});

// listen the request to get the username
MessageService.listen(C.UsernameMessage, (message, callback: Function) => {
    UserService.getCurrentUsername().then(callback);
    return true;
});

// listen changes of map refs and broadcast back to tabs
MessageService.listen(C.ExtraMapRefsChangesMessage, (message, callback: Function) => {
    callback(message.sender);
    message.originalSender = message.sender;
    MessageService.broadcastToTabs(C.ExtraMapRefsChangesMessage, message);
    return true;
});

// listen the request from client page to build a custom tooltip content
MessageService.listenFromExternal(C.BuildTooltipMessage, (tooltipInfo, callback) => {
    TooltipsService.buildCustomTooltipContent(tooltipInfo).then(callback).catch(callback);
    return true;
});

// listen request to open links on new tab and reuse same tab if already opened
// normal scenario is content script needts to use chrome.tabs
MessageService.listen(C.OpenLinkMessage, (msg) => {
    LinkService.toNewTabHandler(msg.address, msg.focus)();
});

BadgeService.updateBadgeCount();

// functions for existing data testing
window.bhdump = function () {
    chrome.storage.sync.get(undefined, storageData => console.log(JSON.stringify(storageData)));
};
window.bhload = function (data: string) {
    chrome.storage.sync.clear(() => chrome.storage.sync.set(JSON.parse(data)));
};
window.bhldump = function () {
    chrome.storage.local.get(undefined, storageData => console.log(JSON.stringify(storageData)));
};
window.bhlload = function (data: string) {
    chrome.storage.local.clear(() => chrome.storage.sync.set(JSON.parse(data)));
};