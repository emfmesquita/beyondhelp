import C from "../../Constants";
import MaphilightService from "../../services/MaphilightService";
import Coordinates from "../../data/Coordinates";

class MapAreaInfo {
    constructor(headerId: string, coords: string, page: string, contentId: string) {
        // should add a link to the map on the header with headerId
        this.addBackLink = headerId && !page && !contentId;

        this.headerId = headerId || "";
        this.coords = coords;
        this.color = C.DDBColors.red;
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
        this.coords = MaphilightService.rect(x1, y1, x2, y2).toString();
        this.shape = C.MapAreaRect;
        return this;
    }

    rho(x1: number, y1: number, x2: number, y2: number): MapAreaInfo {
        this.coords = MaphilightService.rectToRho(x1, y1, x2, y2).toString();
        this.shape = C.MapAreaRhombus;
        return this;
    }

    rhoStr(coords: string): MapAreaInfo {
        this.coords = MaphilightService.strRectToRho(coords).toString();
        this.shape = C.MapAreaRhombus;
        return this;
    }

    chroma(color: string): MapAreaInfo {
        this.color = color;
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