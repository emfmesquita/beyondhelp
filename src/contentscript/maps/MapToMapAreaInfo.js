import MapAreaInfo from "./MapAreaInfo";

class MapToMapAreaInfo extends MapAreaInfo {
    constructor(targetName: string, coords: string) {
        super("", coords, null, null, false, true, "circle");
        this.targetName = targetName;
    }
}

export default MapToMapAreaInfo;