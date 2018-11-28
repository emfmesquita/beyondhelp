import $ from "jquery";
import C from "../../../../Constants";
import Command from "./Command";
import Coordinates from "../../../../data/Coordinates";
import DrawingAreaInfo from "./DrawingAreaInfo";
import DrawingColorService from "./DrawingColorService";
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
    const displayCoords = DrawingCoordsService.toSaveCoords(info.coords, info.areaType);
    let toDisplay: string = null;
    if (info.areaType === C.MapAreaCircle) {
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
    // rho or rect/comment with ctrl => width and height should be the same
    if (C.MapAreaRhombus === currentArea.areaType || ([C.MapAreaRect, C.MapAreaComment].includes(currentArea.areaType) && KeyboardService.isCtrlOn())) {
        DrawingCoordsService.toOneToOneAspectRatio(baseRect);
    }

    // if shift on sizes only changes by minimum of 5
    if (KeyboardService.isShiftOn() && C.MapAreaCircle !== currentArea.areaType) {
        DrawingCoordsService.round(baseRect);
    }

    const safeWidth = [C.MapAreaRect, C.MapAreaComment].includes(currentArea.areaType) ? 10 : 5;
    baseRect.safeRect(safeWidth);

    // applies rect mirror for rho
    if (C.MapAreaRhombus === currentArea.areaType) DrawingCoordsService.rectMirror(baseRect);

    const coords = DrawingCoordsService.rectToShape(baseRect, currentArea.areaType);

    // if shift on radius only changes by minimum of 5
    // made after conversion from rect to circ
    if (KeyboardService.isShiftOn() && C.MapAreaCircle === currentArea.areaType) {
        DrawingCoordsService.circleRound(coords);
    }

    return coords;
};

const resizeWithDelta = (delta: Number) => {
    const baseCoords: Coordinates = currentArea.resizeCoords || currentArea.coords;
    const x1 = baseCoords.x(1);
    const y1 = baseCoords.y(1);

    let newCoords = null;
    if (C.MapAreaCircle === currentArea.areaType) {
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
        // was drawing a new area, on cancel just removes it
        PaperMapService.removeArea(currentArea.mapImage, currentArea.area);
        currentArea.area.detach();
    } else {
        // returs the old coords
        currentArea.coords = currentArea.startCoords;
        toDrawingColor(currentArea, false);
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
        toDrawingColor(currentArea, false);
        DrawingStorageService.saveArea(currentArea);
        PaperMapService.redrawArea(currentArea.mapImage, currentArea.area);
    }

    currentArea = null;
};

const toDrawingColor = (info: DrawingAreaInfo, highlighted: boolean) => {
    const color = DrawingColorService.getColor(info);
    const highlightColor = DrawingColorService.toHighlightColor(color);
    PaperMapService.setAreaData(info.area, "color", highlighted ? highlightColor : color);
    // if already highlighed no need to highlight on mouse over
    PaperMapService.setAreaData(info.area, "highlightColor", highlighted ? undefined : highlightColor);
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

        const areaType = Command.commandToAreaType(currentCommand);
        const shape = Coordinates.areaTypeToShape(areaType);
        const area = $(`<area drawable="true" shape="${shape}" type="${areaType}" coords="${mouseCoords.toString()}">`);
        jqMapAnchor.append(area);
        currentArea = new DrawingAreaInfo(area, areaType, mouseCoords);
        area.attr("bh-id", currentArea.id);
        toDrawingColor(currentArea, true);
        return;
    }

    // is not a drawable area, nothing to do
    if (!isArea(e) || $(e.target).attr("drawable") !== "true") return;

    if (Service.isCommandOn(Command.Move) || Service.isCommandOn(Command.Resize) || Service.isCommandOn(Command.Delete)) {
        const area = $(e.target);

        const shape = area.attr("shape");
        const areaType = area.attr("type");
        const uid = area.attr("bh-id");
        const startCoords = Coordinates.parse(area.attr("coords"));
        currentArea = new DrawingAreaInfo(area, areaType, startCoords).uid(uid);
        toDrawingColor(currentArea, true);

        if (Service.isCommandOn(Command.Move)) currentArea.moving(mouseCoords);
        if (Service.isCommandOn(Command.Resize) && areaType === C.MapAreaRhombus) {
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
    if (!currentArea || [C.MapAreaRect, C.MapAreaComment].includes(currentArea.areaType) || !Service.isCommandOn(Command.Resize)) return;
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
        if ([C.MapAreaRhombus, C.MapAreaCircle].includes(currentArea.areaType)) {
            let delta = keyboardResizeDeltaChart[e.code].r;
            if (KeyboardService.isShiftOn()) delta *= 5;
            resizeWithDelta(delta);
        }
        if ([C.MapAreaRect, C.MapAreaComment].includes(currentArea.areaType)) {
            const multiplier = KeyboardService.isShiftOn() ? 5 : 1;
            let deltaX = multiplier * keyboardResizeDeltaChart[e.code].x;
            if (currentArea.coords.x(2) < currentArea.coords.x(1)) deltaX *= -1;
            let deltaY = multiplier * keyboardResizeDeltaChart[e.code].y;
            if (currentArea.coords.y(2) < currentArea.coords.y(1)) deltaY *= -1;

            if (KeyboardService.isCtrlOn()) {
                if (deltaX !== 0) deltaY = deltaX;
                else deltaX = deltaY;
            }

            let newCoords = null;
            if (C.MapAreaComment === currentArea.areaType) {
                newCoords = Coordinates.commentToRect(currentArea.coords);
            } else {
                newCoords = currentArea.coords.clone();
            }

            newCoords.x(2, newCoords.x(2) + deltaX);
            newCoords.y(2, newCoords.y(2) + deltaY);
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

            const qtipCommand = currentCommand === null ? "enable" : "disable";
            $(".BH-map-ref-comment").qtip(qtipCommand); // enables/disables comment area tooltips
            PageScriptService.run(`Waterdeep.CurseTip.${qtipCommand}();`); // enables/disables other area tooltips
        };
    }

    static isCommandOn(command: number): boolean {
        return currentCommand === command;
    }

    static isAnyCommandOn(): boolean {
        return currentCommand !== null;
    }

    static isDrawingEnabled(): boolean {
        return Service.isCommandOn(Command.Rect) || Service.isCommandOn(Command.Rho) || Service.isCommandOn(Command.Circ) || Service.isCommandOn(Command.Comment);
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