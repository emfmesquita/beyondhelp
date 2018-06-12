import MapAreaInfo from "./MapAreaInfo";
import C from "../../Constants";

class MapToMapAreaInfo extends MapAreaInfo {
    constructor(targetImageName: string, coords: string) {
        super("", coords);
        this.addBackLink = false;
        this.contentOnly = true;
        this.shape = C.MapAreaCircle;
        this.targetImageName = targetImageName;
    }
}

export default MapToMapAreaInfo;