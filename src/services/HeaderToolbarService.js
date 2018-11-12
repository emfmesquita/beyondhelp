const setupClass = "BH-header-toolbar";

const refButtonClass = "BH-ref-button-container";
const mapLinkButtonClass = "BH-map-link-container";

const buttonContainer = (clazz: string) => `<span class='${clazz}'/>`;

const setup = (jqHeader: JQuery<HTMLElement>) => {
    if (jqHeader.hasClass(setupClass)) return;
    jqHeader.addClass(setupClass);
    jqHeader.append(buttonContainer(refButtonClass));
    jqHeader.append(buttonContainer(mapLinkButtonClass));
};

const getContainer = (jqHeader: JQuery<HTMLElement>, clazz: string) => {
    setup(jqHeader);
    return jqHeader.find(`.${clazz}`)[0];
};

/**
 * Service that handle compendium header toolbar. (reference buttons and map link butttons)
 */
class HeaderToolbarService {
    /**
     * Gets the header label, do not include map link or ref copy button
     * @param {JQuery<HTMLElement>} jqHeader 
     */
    static headerLabel(jqHeader: JQuery<HTMLElement>) {
        const headerClone = jqHeader.clone();
        headerClone.find(`.${refButtonClass}`).remove();
        headerClone.find(`.${mapLinkButtonClass}`).remove();
        return headerClone.text();
    }

    static referenceButtonContainer(jqHeader: JQuery<HTMLElement>): HTMLElement {
        return getContainer(jqHeader, refButtonClass);
    }

    static mapLinkButtonContainer(jqHeader: JQuery<HTMLElement>): HTMLElement {
        return getContainer(jqHeader, mapLinkButtonClass);
    }
}

export default HeaderToolbarService;