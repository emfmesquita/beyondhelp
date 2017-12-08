import $ from "jquery";

const guid = function () {
    const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
};

const id = () => `bh-${guid()}`;

class PageScriptService {
    /**
     * Runs a scripts on page that auto removes itself when done.
     * @param {string} script 
     */
    static run(script: string) {
        const currentId = id();
        const autoRemove = `\n$("#${currentId}").detach();`;
        $("body").append(`<script id="${currentId}">${script}${autoRemove}</script>`);
    }
}

export default PageScriptService;