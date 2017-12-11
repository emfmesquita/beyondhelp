import $ from "jquery";
import CharacterData from "../../data/CharacterData";

class MyCharactersParseService {

    /**
     * Parse characters from my characters page as a Array of CharacterData.
     */
    static parseCharacters(): CharacterData[] {
        const characters = [];
        $(".ddb-campaigns-character-card-wrapper").each((index, charWrapperEl) => {
            const jqcharWrapperEl = $(charWrapperEl);
            const name = jqcharWrapperEl.find(".ddb-campaigns-character-card-header-upper-character-info-primary").text();
            const [lvl, race, classes] = jqcharWrapperEl.find(".ddb-campaigns-character-card-header-upper-character-info-secondary").text().split("|");
            const viewUrl = jqcharWrapperEl.find(".ddb-campaigns-character-card-footer-links-item-view").attr("href");
            const [, , , , id] = viewUrl.split("/");

            // workaround for modal links - for some reason the stop to work when the char elements are moved on DOM
            jqcharWrapperEl.find("a.modal-link").attr("onclick", "Cobalt.Forms.handleModalLinks.apply(this, [event])");

            characters.push(new CharacterData(id, name, lvl, race, classes, jqcharWrapperEl[0]));
        });
        return characters;
    }
}

export default MyCharactersParseService;