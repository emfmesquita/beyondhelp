import BadgeService from "../services/BadgeService";
import NotificationService from "../services/NotificationService";
/* global chrome */

// listen the dndbeyound request to gather a monster info
// sends a message to the content script to render the add monster buttons
chrome.webRequest.onCompleted.addListener((details) => chrome.tabs.sendMessage(details.tabId, details), { urls: ["https://www.dndbeyond.com/monsters/*/more-info"] });

// listen when a monster is added from AddMonsterButton, adds a notification
chrome.runtime.onMessage.addListener((request, sender) => {
    NotificationService.createNotification(request.notificationid, request.notification);
    BadgeService.updateBadgeCount();
});

BadgeService.updateBadgeCount();