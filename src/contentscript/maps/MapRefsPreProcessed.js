import MapRefs from "./MapRefs";

class MapRefsPreProcessed extends MapRefs {
    constructor() {
        super();
        this.maps = [];
        this.extraMapLinks = [];
        this.areasByMapImage = {};
        this.path = null;
        this.isOnToc = false;
    }
}

export default MapRefsPreProcessed;