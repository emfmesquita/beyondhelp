import C from "../../Constants";

const midle = (coord1: number, coord2: number) => Math.floor((coord1 + coord2) / 2);

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

    rhoStr(coords: string) {
        const coordsSplited = coords.split(",");
        const x1 = Number.parseInt(coordsSplited[0]);
        const y1 = Number.parseInt(coordsSplited[1]);
        const x2 = Number.parseInt(coordsSplited[2]);
        const y2 = Number.parseInt(coordsSplited[3]);
        this.rho(x1, y1, x2, y2);
        return this;
    }

    chroma(color: string) {
        this.color = color;
        return this;
    }
}

export default MapAreaInfo;