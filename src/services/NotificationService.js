import MonsterData from "../data/MonsterData";
/* global chrome */

class NotificationService {
    static notifyNewMonster(name: string, monster: MonsterData){
        chrome.runtime.sendMessage({
            notificationid: monster.storageId,
            notification: {
                type: "basic",
                iconUrl: "icon-grey-128.png",
                title: "Beyond Help",
                message: `${name} #${monster.number} added with ${monster.hp}HP`
            }
        });
    }
}

export default NotificationService;