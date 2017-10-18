/* global chrome */

class LinkService {

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
}

export default LinkService;