import $ from "jquery";
import PageScriptService from "../../services/PageScriptService";
import loadtinymcebhplugin from "../../clientfiles/loadtinymcebhplugin.js";

class TinyMCEService {
    /**
     * loads bh tinymce plugin on content page
     */
    static init() {
        PageScriptService.run(loadtinymcebhplugin);
    }
}

export default TinyMCEService;