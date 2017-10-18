/* global chrome */

class LinkHandler {
    constructor(address: string) {
        this.address = address;
    }

    static click({ button }: MouseEvent) {
        if (button === 2) return;
        chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
            if (button === 0) {
                if (tab.url === this.address) return;
                chrome.tabs.update(tab.id, { url: this.address });
            } else if (button === 1) {
                chrome.tabs.create({ url: this.address, active: false, index: tab.index + 1 });
            }
        });
    }
}

export default LinkHandler;