import Configuration from "../data/Configuration";
import MessageService from "../services/MessageService";
import PageScriptService from "../services/PageScriptService";

/* global chrome */


class ContentScriptService {
    static init(config: Configuration) {
        PageScriptService.run(`
            window.BeyondHelp = { 
                id : "${chrome.runtime.id}",
                config: ${JSON.stringify(config)}
            }
        `);
    }
}

export default ContentScriptService;