import C from "../Constants";
import MessageService from "./MessageService";
import MonsterData from "../data/MonsterData";

/* global chrome */

const clearAllNotifications = (notifications) => {
    Object.keys(notifications).forEach((id) => {
        if (id && id.startsWith("bh-")) chrome.notifications.clear(id, () => { });
    });
};

class NotificationService {
    static notifyNewMonster(name: string, monster: MonsterData, addNotificationMessage: boolean) {
        MessageService.send(C.AddMonsterMessage, {
            addNotificationMessage,
            notificationid: monster.storageId,
            notification: {
                type: "basic",
                iconUrl: "icon-128.png",
                title: "Beyond Help",
                message: `${name} #${monster.number} added with ${monster.hp}HP`
            }
        });
    }

    static createNotification(newNotificationId: string, newNotification) {
        chrome.notifications.getAll((notifications) => {
            clearAllNotifications(notifications);
            newNotification.silent = true;
            chrome.notifications.create(newNotificationId, newNotification);
        });
    }

    static clearAll() {
        chrome.notifications.getAll(clearAllNotifications);
    }
}

export default NotificationService;