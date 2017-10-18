import StorageService from "./StorageService";

/* global chrome */

class BadgeService {
    static updateBadgeCount() {
        StorageService.countActiveMonsters().then(count => {
            const text = count > 0 ? count + "" : "";
            const color = count > 0 ? [0, 0, 255, 255] : [0, 0, 0, 0];
            chrome.browserAction.setBadgeText({ text });
            chrome.browserAction.setBadgeBackgroundColor({ color });
        });
    }
}

export default BadgeService;