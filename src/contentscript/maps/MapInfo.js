import MapAreaInfo from "./MapAreaInfo";

class MapInfo {
    constructor(menuHeaderId: string, page: string, mapImageName: string, contentId: string, areas: MapAreaInfo[], extraMapLinkSelectors: string[]) {
        this.menuHeaderId = menuHeaderId;
        this.page = page;
        this.mapImageName = mapImageName; // map file name
        this.contentId = contentId; // content id of the paragraph that contains the map, used on the tooltips of links to map
        this.areas = areas;
        this.extraMapLinkSelectors = extraMapLinkSelectors;
        this.basePath = "";
    }

    chMap(): MapInfo {
        this.isChapterMap = true;
        return this;
    }

    tocHId(tocHeaderId: string): MapInfo {
        this.tocHeaderId = tocHeaderId;
        return this;
    }

    tocHSel(tocHeaderSelector: string): MapInfo {
        this.tocHeaderSelector = tocHeaderSelector;
        return this;
    }

    extraMenuLinks(extraMenuHeaderIds: string[]): MapInfo {
        this.extraMenuHeaderIds = extraMenuHeaderIds;
        return this;
    }
}

export default MapInfo;