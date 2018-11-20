import C from "../Constants";
import MessageService from "./MessageService";

/* global chrome */

class LinkService {

    /**
     * Loads the page on left click.
     * Creates new tab next to current on middle click.
     */
    static handler(address: string) {
        return ({ button }: MouseEvent) => {
            if (button === 2) return;
            chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
                if (button === 0) {
                    if (tab.url === address) return;
                    chrome.tabs.update(tab.id, { url: address });
                } else if (button === 1) {
                    chrome.tabs.create({ url: address, active: false, index: tab.index + 1 });
                }
            });
        };
    }

    /**
     * Creates new tab next to current.
     * @param {string} address 
     * @param {boolean} focus Makes the new tab the active one
     */
    static toNewTabHandler(address: string, focus: boolean) {
        return () => {
            chrome.tabs.query({ currentWindow: true, url: address }, ([tab]) => {
                if (tab) {
                    chrome.tabs.update(tab.id, { selected: true });
                    return;
                }
                chrome.tabs.query({ active: true, currentWindow: true }, ([currentTab]) => {
                    chrome.tabs.create({ url: address, active: !!focus, index: currentTab.index + 1 });
                });
            });
        };
    }

    /**
     * Creates new tab next to current, works on content script.
     * @param {*} address 
     * @param {*} focus Makes the new tab the active one
     */
    static contentScriptToNewTabHandler(address: string, focus: boolean) {
        return () => MessageService.send(C.OpenLinkMessage, { address, focus });
    }
}

export default LinkService;