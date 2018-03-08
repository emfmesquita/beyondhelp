import C from "../../Constants";

const midle = (coord1: number, coord2: number) => Math.floor((coord1 + coord2) / 2);

class MapAreaInfo {
    constructor(id: string, coords: string, page: string, contentId: string, addBackLink: boolean = true, contentOnly: boolean, shape = C.MapAreaRect) {
        this.addBackLink = addBackLink && id && !page && !contentId; // should add a link to the map on the target of this area
        this.id = id || "";
        this.coords = coords;
        this.page = page;
        this.contentId = contentId;
        this.contentOnly = contentOnly;
        this.shape = shape;
    }

    content(contentId: string, untilContentId: string): MapAreaInfo {
        this.contentId = contentId;
        this.untilContentId = untilContentId;
        return this;
    }

    rect(x1: number, y1: number, x2: number, y2: number): MapAreaInfo {
        this.coords = [x1, y1, x2, y2].join(",");
        this.shape = C.MapAreaRect;
        return this;
    }

    rho(x1: number, y1: number, x2: number, y2: number): MapAreaInfo {
        const midleX = midle(x1, x2);
        const midleY = midle(y1, y2);
        this.coords = [midleX, y1, x2, midleY, midleX, y2, x1, midleY].join(",");
        this.shape = C.MapAreaRhombus;
        return this;
    }
}

export default MapAreaInfo;