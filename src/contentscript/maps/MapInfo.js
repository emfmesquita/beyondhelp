import MapAreaInfo from "./MapAreaInfo";
import MapLinksInfo from "./MapLinksInfo";

class MapInfo {
    constructor(menuHeaderId: string, page: string, mapImageName: string, contentId: string, areas: MapAreaInfo[], extraMapLinkSelectors: string[], extraMenuHeaderIds: string[]) {
        this.menuHeaderId = menuHeaderId;
        this.page = page;
        this.mapImageName = mapImageName; // map file name
        this.contentId = contentId; // content id of the paragraph that contains the map, used on the tooltips of links to map
        this.areas = areas;
        this.extraMapLinkSelectors = extraMapLinkSelectors;
        this.extraMenuHeaderIds = extraMenuHeaderIds;
        this.mapLinks = MapInfo.processMapLinks(this);
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

    /**
     * Joins areas header ids with extra link selectors and creates map links info.
     * Later used to render links on headers to go back to map.
     * @param {*} mapInfo 
     */
    static processMapLinks(mapInfo: MapInfo): MapLinksInfo {
        let extraMapLinkSelectors = mapInfo.extraMapLinkSelectors || [];

        const areasWithLinks: Set<string> = new Set();
        if (mapInfo.areas) mapInfo.areas.forEach(area => area.addBackLink && areasWithLinks.add("#" + area.headerId));
        if (mapInfo.menuHeaderId) areasWithLinks.add("#" + mapInfo.menuHeaderId);
        if (mapInfo.extraMenuHeaderIds) {
            mapInfo.extraMenuHeaderIds.forEach(menuHeaderId => areasWithLinks.add("#" + menuHeaderId));
        }
        extraMapLinkSelectors = extraMapLinkSelectors.concat(Array.from(areasWithLinks));

        return new MapLinksInfo(mapInfo.page, mapInfo.page, mapInfo.contentId, extraMapLinkSelectors);
    }
}

export default MapInfo;