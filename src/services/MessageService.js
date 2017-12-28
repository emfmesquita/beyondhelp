/* global chrome */

class MessageService {
    static listen(action: string, handler: (message, callback: Function) => boolean) {
        chrome.runtime.onMessage.addListener((request, sender, callback) => {
            if (request.action === action) {
                return handler(request, callback);
            }
        });
    }

    static send(action: string, message: object, callback: Function) {
        message = message || {};
        if (!callback) {
            callback = () => { };
        }
        message.action = action;
        chrome.runtime.sendMessage(message, {}, callback);
    }

    static sendToTab(tabId: number, action: string, message: object, callback: Function) {
        message = message || {};
        if (!callback) {
            callback = () => { };
        }
        message.action = action;
        chrome.tabs.sendMessage(tabId, message, {}, callback);
    }
}

export default MessageService;