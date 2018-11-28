import C from "../../Constants";
import Coordinates from "../../data/Coordinates";
import MapAreaInfo from "./MapAreaInfo";

class MapCommentAreaInfo extends MapAreaInfo {
    constructor(comment: string, coords: string, title: string) {
        super("", Coordinates.strRectToComment(coords).toString());
        this.areaType = C.MapAreaComment;
        this.addBackLinkIfSamePage = false;
        this.contentOnly = true;
        this.areaType = C.MapAreaComment;
        this.comment = comment;
        this.title = title;
    }

    isTooltiplable(): boolean {
        return !!this.comment;
    }
}

export default MapCommentAreaInfo;