const addmonsteronlist = "addmonsteronlist";
const addmonsteronhlist = "addmonsteronhlist";
const addmonsterondetail = "addmonsterondetail";
const tableroll = "tableroll";
const charfavicon = "charfavicon";
const mycharacterfolders = "mycharacterfolders";
const campaigncharacterfolders = "campaigncharacterfolders";
const editorButton = "editorButton";
const fullscreenButton = "fullscreenButton";
const tooltipsTab = "tooltipsTab";
const tablesTab = "tablesTab";
const homebrewTooltips = "homebrewtooltips";
const customTooltips = "customTooltips";
const refTooltips = "refTooltips";
const refButtons = "refButtons";
const pbpNotes = "pbpNotes";

//#region maps
const mapRefs = "mapRefs";
const mapRefsRectTooltips = "mapRefsRectTooltips";
const mapRefsRect = "mapRefsRect";
const mapRefsCircTooltips = "mapRefsCircTooltips";
const mapRefsCirc = "mapRefsCirc";
const mapRefsRhoTooltips = "mapRefsRhoTooltips";
const mapRefsRho = "mapRefsRho";
const mapLinksTooltips = "mapLinksTooltips";
const mapLinks = "mapLinks";
const mapMenuLinksTooltips = "mapMenuLinksTooltips";
const mapMenuLinks = "mapMenuLinks";
const mapTocLinksTooltips = "mapTocLinksTooltips";
const mapTocLinks = "mapTocLinks";
const extraMapRefsMode = "extraMapRefsMode";
//#endregion

const allOptions = [
    addmonsteronlist,
    addmonsteronhlist,
    addmonsterondetail,
    tableroll,
    charfavicon,
    mycharacterfolders,
    campaigncharacterfolders,
    editorButton,
    fullscreenButton,
    tooltipsTab,
    tablesTab,
    homebrewTooltips,
    customTooltips,
    refTooltips,
    refButtons,
    pbpNotes,
    //#region maps
    mapRefs,
    mapRefsRectTooltips,
    mapRefsRect,
    mapRefsCircTooltips,
    mapRefsCirc,
    mapRefsRhoTooltips,
    mapRefsRho,
    mapLinksTooltips,
    mapLinks,
    mapMenuLinksTooltips,
    mapMenuLinks,
    mapTocLinksTooltips,
    mapTocLinks,
    extraMapRefsMode
    //#endregion
];

class Options {
    static get AddMonsterOnList(): string {
        return addmonsteronlist;
    }
    static get AddMonsterOnHomebrewList(): string {
        return addmonsteronhlist;
    }
    static get AddMonsterOnDetail(): string {
        return addmonsterondetail;
    }
    static get TableRolls(): string {
        return tableroll;
    }
    static get CharacterFavIcon(): string {
        return charfavicon;
    }
    static get MyCharactersFolders(): string {
        return mycharacterfolders;
    }
    static get CampaignCharactersFolders(): string {
        return campaigncharacterfolders;
    }
    static get EditorButton(): string {
        return editorButton;
    }
    static get FullscreenButton(): string {
        return fullscreenButton;
    }
    static get TooltipsTab(): string {
        return tooltipsTab;
    }
    static get TablesTab(): string {
        return tablesTab;
    }
    static get HomebrewTooltips(): string {
        return homebrewTooltips;
    }
    static get CustomTooltips(): string {
        return customTooltips;
    }
    static get RefTooltips(): string {
        return refTooltips;
    }
    static get RefButtons(): string {
        return refButtons;
    }
    static get PbpNotes(): string {
        return pbpNotes;
    }
    //#region maps
    static get MapRefs(): string {
        return mapRefs;
    }
    static get MapRefsRectTooltips(): string {
        return mapRefsRectTooltips;
    }
    static get MapRefsRect(): string {
        return mapRefsRect;
    }
    static get MapRefsCircTooltips(): string {
        return mapRefsCircTooltips;
    }
    static get MapRefsCirc(): string {
        return mapRefsCirc;
    }
    static get MapRefsRhoTooltips(): string {
        return mapRefsRhoTooltips;
    }
    static get MapRefsRho(): string {
        return mapRefsRho;
    }
    static get MapLinksTooltips(): string {
        return mapLinksTooltips;
    }
    static get MapLinks(): string {
        return mapLinks;
    }
    static get MapMenuLinksTooltips(): string {
        return mapMenuLinksTooltips;
    }
    static get MapMenuLinks(): string {
        return mapMenuLinks;
    }
    static get MapTocLinksTooltips(): string {
        return mapTocLinksTooltips;
    }
    static get MapTocLinks(): string {
        return mapTocLinks;
    }
    static get ExtraMapRefsMode(): string {
        return extraMapRefsMode;
    }
    //#endregion

    static get AllOptions(): string[] {
        return allOptions.map(option => option);
    }
}

export default Options;