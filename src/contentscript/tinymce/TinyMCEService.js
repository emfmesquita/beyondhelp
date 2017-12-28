import C from "../../Constants";
import MessageService from "../../services/MessageService";
import PageScriptService from "../../services/PageScriptService";
import loadtinymcebhplugin from "../clientfiles/loadtinymcebhplugin.js";

class TinyMCEService {
    static init() {
        // loads bh tinymce plugin on content page
        PageScriptService.run(loadtinymcebhplugin);
    }
}

export default TinyMCEService;