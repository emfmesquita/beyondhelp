import MapAreaInfo from "./MapAreaInfo";

class MapInfo {
    constructor(page: string, name: string, contentId: string, areas: MapAreaInfo[], extraMapLinkSelectors: string[]) {
        this.page = page;
        this.name = name; // map file name
        this.contentId = contentId; // content id of the paragraph that contains the map, used on the tooltips of links to map
        this.areas = areas;
        this.extraMapLinkSelectors = extraMapLinkSelectors;
    }
}

export default MapInfo;