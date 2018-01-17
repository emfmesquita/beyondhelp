/* global chrome */

class MessageService {
    static listen(action: string, handler: (message, callback: Function) => boolean) {
        chrome.runtime.onMessage.addListener((request, sender, callback) => {
            if (request.action === action) {
                return handler(request, callback);
            }
        });
    }

    /**
     * Only the background page can listen from external.
     * @param {*} action 
     * @param {*} handler 
     */
    static listenFromExternal(action: string, handler: (message, callback: Function) => boolean) {
        chrome.runtime.onMessageExternal.addListener((request, sender, callback) => {
            if (request.action === action) {
                return handler(request, callback);
            }
        });
    }

    /**
     * Only the content page can listen from the client page.
     * @param {*} action 
     * @param {*} handler 
     */
    static listenFromClientPage(action: string, handler: (message) => void) {
        window.addEventListener("message", function (event) {
            if (!event.origin.endsWith("dndbeyond.com")) return;
            const message = event.data;
            if (!message || message.id !== chrome.runtime.id || message.action !== action) return;
            handler(message);
        }, false);
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