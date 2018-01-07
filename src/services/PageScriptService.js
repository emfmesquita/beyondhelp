import $ from "jquery";

/* global chrome */

const guid = function () {
    const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
};

const uidClass = () => `bh-${guid()}`;
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