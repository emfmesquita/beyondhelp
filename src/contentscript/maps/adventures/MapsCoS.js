import MapAreaInfo from "../MapAreaInfo";
import MapInfo from "../MapInfo";
import MapRefs from "../MapRefs";
import MapToMapAreaInfo from "../MapToMapAreaInfo";

const maps = [];

const extraMapLinks = [];

MapRefs.processMapToMapRefs(maps);

class MapsCoS extends MapRefs {
    static get path() {
        return "cos/";
    }

    static get maps() {
        return maps;
    }

    static get extraMapLinks() {
        return extraMapLinks;
    }
}

export default MapsCoS;