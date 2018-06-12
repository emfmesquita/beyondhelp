import MapAreaInfo from "./MapAreaInfo";
import MapInfo from "./MapInfo";
import MapLinksInfo from "./MapLinksInfo";
import MapToMapAreaInfo from "./MapToMapAreaInfo";

const processMapLink = (mapLink: MapLinksInfo, basePath: string) => {
    mapLink.fromPage = basePath + mapLink.fromPage;
    mapLink.toPage = basePath + mapLink.toPage;
};

class MapRefs {
    static processMaps(maps: MapInfo[], extraMapLinks: MapLinksInfo[], basePath: string) {
        // process areas and links adding the base path
        maps.forEach(map => {
            map.page = basePath + map.page;
            if (map.areas) map.areas.forEach(area => {
                if (area.page) area.page = basePath + area.page;
            });

            if (map.mapLinks) processMapLink(map.mapLinks, basePath);
        });

        // process map to map
        maps.forEach(map => {
            if (map.areas) map.areas.forEach(area => {
                if (!(area instanceof MapToMapAreaInfo)) return;
                const mapToMap: MapToMapAreaInfo = area;
                const targetMap = maps.find(map => map.mapImageName === mapToMap.targetImageName);
                if (!targetMap) return;
                mapToMap.page = targetMap.page;
                mapToMap.contentId = targetMap.contentId;
            });
        });

        // process extra map links
        if (extraMapLinks) extraMapLinks.forEach(extraMapLink => processMapLink(extraMapLink, basePath));
    }

    static get path(): string {
        throw new Error("abstract");
    }

    static get maps(): MapInfo[] {
        throw new Error("abstract");
    }

    static get extraMapLinks(): MapLinksInfo[] {
        throw new Error("abstract");
    }
}

export default MapRefs;