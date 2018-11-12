import $ from "jquery";
import C from "../../../../Constants";
import Coordinates from "../../../../data/Coordinates";
import DrawingAreaInfo from "./DrawingAreaInfo";

const jqWindow = $(window);

let jqDrawingCoordsSpan: JQuery<HTMLElement> = null;
const coordsSpan = () => {
    if (!jqDrawingCoordsSpan) jqDrawingCoordsSpan = $(".BH-extra-map-refs-drawing-coords");
    return jqDrawingCoordsSpan;
};

const coordsFunc = {
    [C.MapAreaRect]: Coordinates.rect,
    [C.MapAreaRhombus]: Coordinates.rectToRho,
    [C.MapAreaCircle]: Coordinates.rectToCir
};

const roundMinDelta = 5;

const getMapImage = (e: MouseEvent) => {
    return $(e.target).closest("a").find("img");
};

const toSaveCoords = (coords: Coordinates, shape: string): Coordinates => {
    if (shape === C.MapAreaCircle || shape === C.MapAreaRect) return coords.clone();
    return Coordinates.rhoToRect(coords);
};

class DrawingCoordsService {
    static getImageCoords(jqImg: JQuery<HTMLElement>): Coordinates {
        return new Coordinates(0, 0).add(jqImg.width(), jqImg.height());
    }

    static getUnsafeMouseCoords(e: MouseEvent): Coordinates {
        const jqMap = getMapImage(e);
        const offset = jqMap.offset();

        const imageLeft = Math.round(offset.left - jqWindow.scrollLeft());
        const mapPositionX = e.clientX - imageLeft;

        const imageTop = Math.round(offset.top - jqWindow.scrollTop());
        const mapPositionY = e.clientY - imageTop;

        return new Coordinates(mapPositionX, mapPositionY);
    }

    static isOverMap(e: MouseEvent): boolean {
        const coords = DrawingCoordsService.getUnsafeMouseCoords(e);
        const imageCoords = DrawingCoordsService.getImageCoords(getMapImage(e));
        return coords.isInsideRect(imageCoords);
    }

    static getMouseCoords(e: MouseEvent): Coordinates {
        const coords = DrawingCoordsService.getUnsafeMouseCoords(e);
        const imageCoords = DrawingCoordsService.getImageCoords(getMapImage(e));

        if (coords.x(1) < 0) coords.x(1, 0);
        if (coords.x(1) > imageCoords.x(2)) coords.x(1, imageCoords.x(2));
        if (coords.y(1) < 0) coords.y(1, 0);
        if (coords.y(1) > imageCoords.y(2)) coords.y(1, imageCoords.y(2));

        return coords;
    }

    static toSaveCoords(coords: Coordinates, shape: string): Coordinates {
        if (shape === C.MapAreaCircle || shape === C.MapAreaRect) return coords.clone();
        return Coordinates.rhoToRect(coords);
    }

    static setToolbarCoords(text: string) {
        coordsSpan().html(text);
    }

    static rectMirror(rect: Coordinates): Coordinates {
        const x1 = rect.x(1);
        const x2 = rect.x(2);
        const y1 = rect.y(1);
        const y2 = rect.y(2);

        const deltaX = x2 - x1;
        const deltaY = y2 - y1;
        rect.x(1, x1 - deltaX);
        rect.y(1, y1 - deltaY);
    }

    static toOneToOneAspectRatio(rect: Coordinates) {
        const x1 = rect.x(1);
        const x2 = rect.x(2);
        const y1 = rect.y(1);
        const y2 = rect.y(2);

        const width = Math.abs(x2 - x1);
        const height = Math.abs(y2 - y1);
        if (width > height) {
            rect.y(2, y2 < y1 ? y1 - width : y1 + width);
        } else {
            rect.x(2, x2 < x1 ? x1 - height : x1 + height);
        }
    }

    static round(rect: Coordinates) {
        const x1 = rect.x(1);
        const x2 = rect.x(2);
        const y1 = rect.y(1);
        const y2 = rect.y(2);

        const width = Math.abs(x2 - x1);
        const widthRemainder = width % roundMinDelta;
        if (widthRemainder !== 0) {
            rect.x(2, x2 < x1 ? x2 + widthRemainder : x2 - widthRemainder);
        }
        if (x1 === rect.x(2)) rect.x(2, x2 < x1 ? x1 - roundMinDelta : x1 + roundMinDelta);

        const height = Math.abs(y2 - y1);
        const heightRemainder = height % roundMinDelta;
        if (heightRemainder !== 0) {
            rect.y(2, y2 < y1 ? y2 + heightRemainder : y2 - heightRemainder);
        }
        if (y1 === rect.y(2)) rect.y(2, y2 < y1 ? y1 - roundMinDelta : y1 + roundMinDelta);
    }

    static circleRound(circle: Coordinates) {
        const radiusRemainder = circle.r % roundMinDelta;
        if (radiusRemainder !== 0) circle.r -= radiusRemainder;
        if (circle.r === 0) circle.r = roundMinDelta;
    }

    static rectToShape(rect: Coordinates, shape: string): Coordinates {
        return coordsFunc[shape](rect.x(1), rect.y(1), rect.x(2), rect.y(2));
    }
}

export default DrawingCoordsService;