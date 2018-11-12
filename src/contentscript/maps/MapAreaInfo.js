import C from "../../Constants";
import Coordinates from "../../data/Coordinates";

class MapAreaInfo {
    constructor(headerId: string, coords: string, page: string, contentId: string) {
        // should add a link to the map on the header with headerId
        // if the area has the same page (or no page) as the map
        this.addBackLinkIfSamePage = headerId && !contentId;

        this.headerId = headerId || "";
        this.coords = coords;
        this.color = C.DDBColors.red;
        this.highlightColor = null;
        this.page = page;
        this.contentId = contentId;
        this.contentOnly = false;
        this.shape = C.MapAreaRect;
        this.id = null;
        this.isDrawable = false;
    }

    uid(id: string): DrawingAreaInfo {
        this.id = id;
        return this;
    }

    content(contentId: string, untilContentId: string): MapAreaInfo {
        this.contentId = contentId;
        this.untilContentId = untilContentId;
        return this;
    }

    fromPage(page: string): MapAreaInfo {
        this.page = page;
        return this;
    }

    rect(x1: number, y1: number, x2: number, y2: number): MapAreaInfo {
        this.coords = Coordinates.rect(x1, y1, x2, y2).toString();
        this.shape = C.MapAreaRect;
        return this;
    }

    rho(x1: number, y1: number, x2: number, y2: number): MapAreaInfo {
        this.coords = Coordinates.rectToRho(x1, y1, x2, y2).toString();
        this.shape = C.MapAreaRhombus;
        return this;
    }

    rhoStr(coords: string): MapAreaInfo {
        this.coords = Coordinates.strRectToRho(coords).toString();
        this.shape = C.MapAreaRhombus;
        return this;
    }

    chroma(color: string, highlightColor: string): MapAreaInfo {
        this.color = color;
        this.highlightColor = highlightColor;
        return this;
    }

    drawable(): MapAreaInfo {
        this.isDrawable = true;
        return this;
    }

    isTooltiplable(): boolean {
        return !!this.contentId || !!this.headerId;
    }
}

export default MapAreaInfo;