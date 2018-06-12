import MapAreaInfo from "../MapAreaInfo";
import MapInfo from "../MapInfo";
import MapRefs from "../MapRefs";
import MapToMapAreaInfo from "../MapToMapAreaInfo";

const maps = [];

const path = "adventures/cos/";

MapRefs.processMaps(maps, [], path);

class MapsCoS extends MapRefs {
    static get path() {
        return path;
    }

    static get maps() {
        return maps;
    }

    static get extraMapLinks() {
        return [];
    }
}

export default MapsCoS;