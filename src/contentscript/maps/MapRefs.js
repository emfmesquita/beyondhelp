import MapAreaInfo from "./MapAreaInfo";
import MapInfo from "./MapInfo";
import MapLinksInfo from "./MapLinksInfo";
import MapToMapAreaInfo from "./MapToMapAreaInfo";

class MapRefs {
    static processMapToMapRefs(maps: MapInfo[]) {
        maps.forEach(map => {
            map.areas.forEach(area => {
                if (!(area instanceof MapToMapAreaInfo)) return;
                const mapToMap: MapToMapAreaInfo = area;
                const targetMap = maps.find(map => map.name === mapToMap.targetName);
                if (!targetMap) return;
                mapToMap.page = targetMap.page;
                mapToMap.contentId = targetMap.contentId;
            });
        });
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