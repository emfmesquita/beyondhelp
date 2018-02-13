import $ from "jquery";

class ReferencesUtils {

    /**
     * Gets the header label, do not include map link or ref copy button
     * @param {JQuery<HTMLElement>} jqHeader 
     */
    static headerLabel(jqHeader: JQuery<HTMLElement>) {
        const headerClone = jqHeader.clone();
        headerClone.find(".BH-map-link-container").remove();
        headerClone.find(".BH-ref-button-container").remove();
        return headerClone.text();
    }
}

export default ReferencesUtils;