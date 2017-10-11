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

    static clearAll(){
        chrome.notifications.getAll((notifications) => {
            Object.keys(notifications).forEach((id) => {
                if(id && id.startsWith("bh-")) chrome.notifications.clear(id, () => { });
            });
        });
    }
}

export default NotificationService;