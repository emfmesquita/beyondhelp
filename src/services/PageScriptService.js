import $ from "jquery";
import UidService from "./UidService";

/* global chrome */

const uidClass = () => `bh-${UidService.id()}`;
const autoRemove = (className: string) => `$(".${className}").remove();`;

class PageScriptService {
    /**
     * Runs a script on client page that auto removes itself when done.
     * @param {string} script 
     */
    static run(script: string) {
        const className = uidClass();
        $("body").append(`
            <script class="${className}">
                (function() {
                    ${script}
                    ${autoRemove(className)}
                })();
            </script>
        `);
    }

    /**
     * Runs a script file  on client page that auto removes itself when done. The file needs to be on webaccessible folder.
     * @param {string} fileName 
     */
    static runFile(fileName: string) {
        const className = uidClass();
        $("body").append(`<script class="${className}" src="chrome-extension://${chrome.runtime.id}/webaccessible/${fileName}"/>`);
        $("body").append(`<script class="${className}">${autoRemove(className)}</script>`);
    }
}

export default PageScriptService;