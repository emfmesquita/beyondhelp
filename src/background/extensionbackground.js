import BadgeService from "../services/BadgeService";
import C from "../Constants";
import MessageService from "../services/MessageService";
import NotificationService from "../services/NotificationService";
import UserService from "../services/UserService";

/* global chrome */

// listen the dndbeyound request to gather a more info
// sends a message to the content script to render the add monster buttons and parse roll tables
chrome.webRequest.onCompleted.addListener((details) => MessageService.sendToTab(details.tabId, C.RowLoadedMessage), {
    urls: [
        "https://www.dndbeyond.com/magic-items/*/more-info",
        "https://www.dndbeyond.com/monsters/*/more-info",
        "https://www.dndbeyond.com/spells/*/more-info",
        "https://www.dndbeyond.com/characters/backgrounds/*/more-info",
        "https://www.dndbeyond.com/characters/feats/*/more-info"
    ]
});

// listen when a monster is added from AddMonsterButton, adds a notification
MessageService.listen(C.AddMonsterMessage, (message) => {
    NotificationService.createNotification(message.notificationid, message.notification);
    BadgeService.updateBadgeCount();
});

// listen the request to get the username
MessageService.listen(C.UsernameMessage, (message, callback: Function) => {
    UserService.getCurrentUsername().then(callback);
    return true;
});

BadgeService.updateBadgeCount();

// functions for existing data testing
window.bhdump = function () {
    chrome.storage.sync.get(undefined, storageData => console.log(JSON.stringify(storageData)));
};
window.bhload = function (data: string) {
    chrome.storage.sync.clear(() => chrome.storage.sync.set(JSON.parse(data)));
};