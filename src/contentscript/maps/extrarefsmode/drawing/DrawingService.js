import $ from "jquery";
import C from "../../../../Constants";
import Command from "./Command";
import Coordinates from "../../../../data/Coordinates";
import DrawingAreaInfo from "./DrawingAreaInfo";
import DrawingCoordsService from "./DrawingCoordsService";
import DrawingStorageService from "./DrawingStorageService";
import KeyboardService from "../../../../services/KeyboardService";
import PageScriptService from "../../../../services/PageScriptService";
import PaperMapService from "../../../../services/PaperMapService";
import { throttle } from "lodash";

const isTag = (e: MouseEvent, tag: string) => e.target.tagName === tag;
const isArea = (e) => isTag(e, "AREA");
const isImg = (e) => isTag(e, "IMG");

let globalInit = false;
let currentCommand = null;
let currentArea: DrawingAreaInfo = null;
let dragging: boolean = false;

//#region drawing
const getMapImage = (e: MouseEvent) => {
    return $(e.target).closest("a").find("img");
};

const redrawArea = (info: DrawingAreaInfo) => {
    const displayCoords = DrawingCoordsService.toSaveCoords(info.coords, info.shape);
    let toDisplay: string = null;
    if (info.shape === C.MapAreaCircle) {
        toDisplay = `${displayCoords.toString()}   r: ${info.coords.r}`;
    } else {
        toDisplay = `${displayCoords.toString()}   s: ${displayCoords.rectWidth()}x${displayCoords.rectHeight()}`;
    }

    DrawingCoordsService.setToolbarCoords(toDisplay);

    info.area.attr("coords", info.coords.toString());
    PaperMapService.redrawArea(info.mapImage, info.area);
};

const safeBoundsRedrawCurrentArea = (newCoords: Coordinates): boolean => {
    const imageCoords = currentArea.mapImageCoords;
    if (!newCoords.isInsideRect(imageCoords)) return false;
    currentArea.coords = newCoords;
    redrawArea(currentArea);
    return true;
};

/**
 * Redraws current area using new coords inside map image, translating coords to stay inbounds.
 * @param {*} newCoords 
 */
const safeBoundsRedrawWithTranslate = (newCoords: Coordinates) => {
    const imageCoords = currentArea.mapImageCoords;
    if (!newCoords.isInsideRect(imageCoords)) newCoords.translateInsideRect(imageCoords);
    currentArea.coords = newCoords;
    redrawArea(currentArea);
};

const resizedRectToShape = (baseRect: Coordinates): Coordinates => {
    // rho or rect with ctrl => width and height should be the same
    if (C.MapAreaRhombus === currentArea.shape || (C.MapAreaRect === currentArea.shape && KeyboardService.isCtrlOn())) {
        DrawingCoordsService.toOneToOneAspectRatio(baseRect);
    }

    // if shift on sizes only changes by minimum of 5
    if (KeyboardService.isShiftOn() && C.MapAreaCircle !== currentArea.shape) {
        DrawingCoordsService.round(baseRect);
    }

    const safeWidth = C.MapAreaRect === currentArea.shape ? 10 : 5;
    baseRect.safeRect(safeWidth);

    // applies rect mirror for rho
    if (C.MapAreaRhombus === currentArea.shape) DrawingCoordsService.rectMirror(baseRect);

    const coords = DrawingCoordsService.rectToShape(baseRect, currentArea.shape);

    // if shift on radius only changes by minimum of 5
    // made after conversion from rect to circ
    if (KeyboardService.isShiftOn() && C.MapAreaCircle === currentArea.shape) {
        DrawingCoordsService.circleRound(coords);
    }

    return coords;
};

const resizeWithDelta = (delta: Number) => {
    const baseCoords: Coordinates = currentArea.resizeCoords || currentArea.coords;
    const x1 = baseCoords.x(1);
    const y1 = baseCoords.y(1);

    let newCoords = null;
    if (C.MapAreaCircle === currentArea.shape) {
        newCoords = new Coordinates(x1, y1).radius(baseCoords.r + delta);

        // if shift on radius only changes by minimum of 5
        // made after conversion from rect to circ
        if (KeyboardService.isShiftOn()) {
            DrawingCoordsService.circleRound(newCoords);
        }
    } else {
        const width = Math.abs(currentArea.coords.x(4) - currentArea.coords.x(2));
        let r = width / 2;
        r += delta;
        if (r < 1) r = 1;

        const newBaseRect = new Coordinates(x1, y1).add(x1 + r, y1);
        newCoords = resizedRectToShape(newBaseRect);
    }
    safeBoundsRedrawCurrentArea(newCoords);
};

const cancelDrawing = () => {
    if (!currentArea) return;

    if (Service.isDrawingEnabled()) {
        PaperMapService.removeArea(currentArea.mapImage, currentArea.area);
        currentArea.area.detach();
    } else {
        currentArea.coords = currentArea.startCoords;
        toDrawingBundleColor(currentArea.area);
        redrawArea(currentArea);
    }
    currentArea = null;
};

const confirmDrawing = () => {
    if (!currentArea) return;

    if (Service.isCommandOn(Command.Delete)) {
        currentArea.area.detach();
        DrawingStorageService.deleteArea(currentArea);
        PaperMapService.removeArea(currentArea.mapImage, currentArea.area);
    } else {
        toDrawingBundleColor(currentArea.area);
        DrawingStorageService.saveArea(currentArea);
        PaperMapService.redrawArea(currentArea.mapImage, currentArea.area);
    }

    currentArea = null;
};

const toDrawingBundleColor = (jqArea: JQuery<HTMLElement>) => {
    PaperMapService.setAreaData(jqArea, "color", C.DDBColors.green);
    PaperMapService.setAreaData(jqArea, "highlightColor", C.ExtraColors.lightOrange);
};

const toDrawingAreaColor = (jqArea: JQuery<HTMLElement>) => {
    PaperMapService.setAreaData(jqArea, "color", C.DDBColors.orange);
    PaperMapService.setAreaData(jqArea, "highlightColor", undefined);
};
//#endregion

//#region mouse event handlers
const mouseDown = (e: MouseEvent) => {
    if (!Service.isAnyCommandOn()) return;
    e.preventDefault();
    e.stopPropagation();
    if (e.button !== 0) return;

    // was moving/resizing and clicked out of current area
    if (currentArea && (!isArea(e) || e.target !== currentArea.area[0])) confirmDrawing();

    if (!isImg(e) && !isArea(e)) return;

    dragging = true;

    // was moving/resizing and clicked on current area
    if (currentArea && isArea(e) && e.target === currentArea.area[0]) return;

    const mouseCoords = DrawingCoordsService.getMouseCoords(e);

    if (Service.isDrawingEnabled()) {
        const jqMapAnchor = $(e.target).closest("a").find("map");
        if (jqMapAnchor.length === 0) return;

        const shape = Command.mathlightShape(currentCommand);
        const area = $(`<area drawable="true" shape="${shape}" coords="${mouseCoords.toString()}">`);
        jqMapAnchor.append(area);
        currentArea = new DrawingAreaInfo(area, shape, mouseCoords);
        area.attr("bh-id", currentArea.id);
        toDrawingAreaColor(area);
        return;
    }

    // is not a drawable area, nothing to do
    if (!isArea(e) || $(e.target).attr("drawable") !== "true") return;

    if (Service.isCommandOn(Command.Move) || Service.isCommandOn(Command.Resize) || Service.isCommandOn(Command.Delete)) {
        const area = $(e.target);
        toDrawingAreaColor(area);

        const shape = area.attr("shape");
        const uid = area.attr("bh-id");
        const startCoords = Coordinates.parse(area.attr("coords"));
        currentArea = new DrawingAreaInfo(area, shape, startCoords).uid(uid);

        if (Service.isCommandOn(Command.Move)) currentArea.moving(mouseCoords);
        if (Service.isCommandOn(Command.Resize) && shape === C.MapAreaRhombus) {
            currentArea.resizeCoords = Coordinates.rhoToRect(currentArea.startCoords).rectCenter();
        }

        redrawArea(currentArea);
    }
};

const mouseUp = (e: MouseEvent) => {
    dragging = false;
    if (!currentArea) return;

    if (currentArea.dragged || Service.isCommandOn(Command.Delete)) {
        confirmDrawing();
    } else if (Service.isDrawingEnabled()) {
        cancelDrawing();
    }
};

const click = (e: MouseEvent) => {
    if (Service.isAnyCommandOn()) {
        e.preventDefault();
        e.stopPropagation();
    }
};

const mouseWheel = (e: WheelEvent) => {
    if (!currentArea || C.MapAreaRect === currentArea.shape || !Service.isCommandOn(Command.Resize)) return;
    e.preventDefault();
    e.stopPropagation();

    let delta = e.deltaY > 0 ? -1 : 1;
    if (KeyboardService.isShiftOn()) delta *= 5;
    resizeWithDelta(delta);
};

const mouseMove = (e: MouseEvent) => {
    if (!Service.isAnyCommandOn() || (!isImg(e) && !isArea(e))) return;

    const mouseCoords = DrawingCoordsService.getMouseCoords(e);

    if (!currentArea) {
        DrawingCoordsService.setToolbarCoords(mouseCoords.toString());
    } else if (dragging && (Service.isDrawingEnabled() || Service.isCommandOn(Command.Resize))) {
        currentArea.dragged = true;

        const baseCoords = currentArea.resizeCoords || currentArea.startCoords;
        const x1 = baseCoords.x(1);
        const y1 = baseCoords.y(1);
        const baseRect = new Coordinates(x1, y1).add(mouseCoords.x(1), mouseCoords.y(1));

        const newCoords = resizedRectToShape(baseRect);
        safeBoundsRedrawCurrentArea(newCoords);
    } else if (dragging && Service.isCommandOn(Command.Move)) {
        currentArea.dragged = true;
        currentArea.movingCoords.x(2, mouseCoords.x(1));
        currentArea.movingCoords.y(2, mouseCoords.y(1));
        const newCoords = currentArea.startCoords.clone().translate(currentArea.movingCoords);
        safeBoundsRedrawWithTranslate(newCoords);
    }
};

const mouseOut = (e: MouseEvent) => {
    if (!isImg(e) || DrawingCoordsService.isOverMap(e) || currentArea) return;
    setTimeout(() => DrawingCoordsService.setToolbarCoords("0,0"), 100); // forces execution after throttle
};
//#endregion

//#region keyboard
const keyboardMoveDeltaChart = {
    ArrowLeft: { x: -1, y: 0 },
    ArrowUp: { x: 0, y: -1 },
    ArrowRight: { x: 1, y: 0 },
    ArrowDown: { x: 0, y: 1 }
};

const keyboardResizeDeltaChart = {
    ArrowLeft: { x: -1, y: 0, r: -1 },
    ArrowUp: { x: 0, y: 1, r: 1 },
    ArrowRight: { x: 1, y: 0, r: 1 },
    ArrowDown: { x: 0, y: -1, r: -1 }
};

const keyboardArrow = (e: KeyboardEvent) => {
    if (Service.isCommandOn(Command.Move)) {
        const delta = keyboardMoveDeltaChart[e.code];
        const multiplier = KeyboardService.isCtrlOn() ? 100 : KeyboardService.isShiftOn() ? 10 : 1;
        if (!currentArea.coords) currentArea.coords = currentArea.startCoords.clone();

        const newCoords = currentArea.coords.clone();
        newCoords.translateWithDelta(multiplier * delta.x, multiplier * delta.y);
        safeBoundsRedrawWithTranslate(newCoords);
    }

    if (Service.isCommandOn(Command.Resize)) {
        if (C.MapAreaRhombus === currentArea.shape || C.MapAreaCircle === currentArea.shape) {
            let delta = keyboardResizeDeltaChart[e.code].r;
            if (KeyboardService.isShiftOn()) delta *= 5;
            resizeWithDelta(delta);
        }
        if (C.MapAreaRect === currentArea.shape) {
            const multiplier = KeyboardService.isShiftOn() ? 5 : 1;
            let deltaX = multiplier * keyboardResizeDeltaChart[e.code].x;
            if (currentArea.coords.x(2) < currentArea.coords.x(1)) deltaX *= -1;
            let deltaY = multiplier * keyboardResizeDeltaChart[e.code].y;
            if (currentArea.coords.y(2) < currentArea.coords.y(1)) deltaY *= -1;

            if (KeyboardService.isCtrlOn()) {
                if (deltaX !== 0) deltaY = deltaX;
                else deltaX = deltaY;
            }

            let newCoords = currentArea.coords.clone();
            newCoords.x(2, currentArea.coords.x(2) + deltaX);
            newCoords.y(2, currentArea.coords.y(2) + deltaY);
            newCoords = resizedRectToShape(newCoords);
            safeBoundsRedrawCurrentArea(newCoords);
        }
    }
};

const keyboardInit = () => {
    // cancel Drawing
    KeyboardService.down().codes("Escape", "Backspace").noRepeat().handler(cancelDrawing);

    // confirm drawing/delete on enter
    KeyboardService.down().keys("Enter").noRepeat().handler(() => confirmDrawing());

    // keyboard move with arrows
    KeyboardService.down().codes("ArrowLeft", "ArrowUp", "ArrowRight", "ArrowDown").IF(() => {
        return currentArea && !dragging && (Service.isCommandOn(Command.Move) || Service.isCommandOn(Command.Resize));
    }).throttle(100).handler(keyboardArrow);
};
//#endregion


class DrawingService {
    static toggleFunc(toToggleCommand: number): Function {
        return () => {
            confirmDrawing();
            currentCommand = currentCommand === toToggleCommand ? null : toToggleCommand;
            PageScriptService.run(`Waterdeep.CurseTip.${currentCommand === null ? "enable()" : "disable()"};`);
        };
    }

    static isCommandOn(command: number): boolean {
        return currentCommand === command;
    }

    static isAnyCommandOn(): boolean {
        return currentCommand !== null;
    }

    static isDrawingEnabled(): boolean {
        return Service.isCommandOn(Command.Rect) || Service.isCommandOn(Command.Rho) || Service.isCommandOn(Command.Circ);
    }

    static init() {
        keyboardInit();
    }

    static initMap(jqImg: JQuery<HTMLElement>) {
        if (!globalInit) {
            globalInit = true;
            document.addEventListener("mouseup", mouseUp);
            document.addEventListener("wheel", mouseWheel);
        }

        const jqImgAnchor = jqImg.closest("a");
        jqImgAnchor.mousedown(mouseDown);
        jqImgAnchor.on("click", click);
        jqImgAnchor.contextmenu(() => false);
        jqImgAnchor.mousemove(throttle(mouseMove, 20));
        jqImgAnchor.mouseout(mouseOut);
    }
}

const Service = DrawingService;

export default DrawingService;