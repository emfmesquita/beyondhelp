import $ from "jquery";
import C from "../../Constants";
import MessageService from "../../services/MessageService";
import PageScriptService from "../../services/PageScriptService";
import loadtinymcebhplugin from "../clientfiles/loadtinymcebhplugin.js";

class TinyMCEService {
    /**
     * loads bh tinymce plugin on content page
     */
    static init() {
        PageScriptService.run(loadtinymcebhplugin);
    }

    static homebrewSpellTooltipWorkaround() {
        $(".tooltip-hover[href^='https://www.dndbeyond.com/spells/']").addClass("spell-tooltip");
    }
}

export default TinyMCEService;