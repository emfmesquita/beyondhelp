import Coordinates from "../../../../data/Coordinates";
import UidService from "../../../../services/UidService";
import $ from "jquery";

class DrawingAreaInfo {
    constructor(area: JQuery<HTMLElement>, shape: string, startCoords: Coordinates) {
        this.id = UidService.id();
        this.area = area;
        this.mapImage = area.closest("a").find("img");
        this.shape = shape;

        this.startCoords = startCoords;
        this.coords = startCoords.clone();
        this.movingCoords = null;
        this.resizeCoords = null;

        this.dragged = false;
    }

    uid(id: string): DrawingAreaInfo {
        this.id = id;
        return this;
    }

    moving(coords: Coordinates): DrawingAreaInfo {
        this.movingCoords = coords;
        return this;
    }
}

export default DrawingAreaInfo;