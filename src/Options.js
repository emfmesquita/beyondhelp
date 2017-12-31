const addmonsteronlist = "addmonsteronlist";
const addmonsteronhlist = "addmonsteronhlist";
const addmonsterondetail = "addmonsterondetail";
const tableroll = "tableroll";
const charfavicon = "charfavicon";
const mycharacterfolders = "mycharacterfolders";
const campaigncharacterfolders = "campaigncharacterfolders";
const editorButton = "editorButton";
const homebrewTooltips = "homebrewtooltips";

const allOptions = [
    addmonsteronlist,
    addmonsteronhlist,
    addmonsterondetail,
    tableroll,
    charfavicon,
    mycharacterfolders,
    campaigncharacterfolders,
    editorButton,
    homebrewTooltips
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
    static get HomebrewTooltips(): string {
        return homebrewTooltips;
    }


    static get AllOptions(): string[] {
        return allOptions.map(option => option);
    }
}

export default Options;