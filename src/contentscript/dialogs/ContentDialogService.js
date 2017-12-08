import PageScriptService from "../../services/PageScriptService";

class ContentDialogService {
    /**
     * Opens a dialog on content page.
     * @param {string} id target element id
     */
    static open(id: string) {
        const dialogOptions = `{ width: "auto", beforeClose: () => $("body").css("overflow", "inherit")}`;
        PageScriptService.run(`$("#${id}").dialog(${dialogOptions}); $("body").css("overflow", "hidden");`);
    }

    /**
     * Closes a dialog on content page.
     * @param {string} id target element id
     */
    static close(id: string) {
        PageScriptService.run(`$("#${id}").dialog("close");`);
    }
}

export default ContentDialogService;