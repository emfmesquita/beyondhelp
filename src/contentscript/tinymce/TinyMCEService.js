import PageScriptService from "../../services/PageScriptService";

class TinyMCEService {
    /**
     * loads bh tinymce plugin on content page
     */
    static init() {
        PageScriptService.runFile("loadtinymcebhplugin.js");
    }
}

export default TinyMCEService;