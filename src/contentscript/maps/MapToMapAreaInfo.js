import MapAreaInfo from "./MapAreaInfo";

class MapToMapAreaInfo extends MapAreaInfo {
    constructor(targetName: string, coords: string) {
        super("", coords, null, null, false, true, true);
        this.targetName = targetName;
    }
}

export default MapToMapAreaInfo;