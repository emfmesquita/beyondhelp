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
     */
    static toNewTabHandler(address: string, focus: boolean) {
        return () => {
            chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
                if (tab.url === address) return;
                chrome.tabs.create({ url: address, active: !!focus, index: tab.index + 1 });
            });
        };
    }
}

export default LinkService;