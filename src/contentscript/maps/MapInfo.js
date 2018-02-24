import MapAreaInfo from "./MapAreaInfo";
import MapLinksInfo from "./MapLinksInfo";

class MapInfo {
    constructor(headerId: string, page: string, name: string, contentId: string, areas: MapAreaInfo[], extraMapLinkSelectors: string[]) {
        this.headerId = headerId;
        this.page = page;
        this.name = name; // map file name
        this.contentId = contentId; // content id of the paragraph that contains the map, used on the tooltips of links to map
        this.areas = areas;


        // map links
        let mapLinksSelectors = extraMapLinkSelectors || [];

        const areasWithLinks: Set<string> = new Set();
        areas.forEach(area => area.addBackLink && areasWithLinks.add("#" + area.id));
        areasWithLinks.add("#" + headerId);
        mapLinksSelectors = mapLinksSelectors.concat(Array.from(areasWithLinks));

        this.mapLinks = new MapLinksInfo(page, page, contentId, mapLinksSelectors);
    }

    chMap(): MapInfo {
        this.isChapterMap = true;
        return this;
    }

    tocHSel(tocHeaderSelector: string): MapInfo {
        this.tocHeaderSelector = tocHeaderSelector;
        return this;
    }
}

export default MapInfo;