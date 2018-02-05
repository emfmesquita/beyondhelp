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
const mapRefs = "mapRefs";

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
    mapRefs
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
    static get MapRefs(): string {
        return mapRefs;
    }

    static get AllOptions(): string[] {
        return allOptions.map(option => option);
    }
}

export default Options;