import MapAreaInfo from "./MapAreaInfo";
import MapInfo from "./MapInfo";
import MapLinksInfo from "./MapLinksInfo";
import MapToMapAreaInfo from "./MapToMapAreaInfo";

class MapRefs {
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