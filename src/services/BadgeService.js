import MonsterStorageService from "./storage/MonsterStorageService";

/* global chrome */

class BadgeService {
    static updateBadgeCount() {
        MonsterStorageService.countActiveMonsters().then(({ alive, total }) => {
            const text = total > 0 ? `${alive}/${total}` : "";
            const color = total > 0 ? [0, 0, 255, 255] : [0, 0, 0, 0];
            chrome.browserAction.setBadgeText({ text });
            chrome.browserAction.setBadgeBackgroundColor({ color });
        });
    }
}

export default BadgeService;