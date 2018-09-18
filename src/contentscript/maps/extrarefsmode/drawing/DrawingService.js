import $ from "jquery";
import C from "../../../../Constants";
import Command from "./Command";
import Coordinates from "../../../../data/Coordinates";
import DrawingAreaInfo from "./DrawingAreaInfo";
import DrawingCoordsService from "./DrawingCoordsService";
import DrawingStorageService from "./DrawingStorageService";
import KeyboardService from "../../../../services/KeyboardService";
import MaphilightService from "../../../../services/MaphilightService";
import PageScriptService from "../../../../services/PageScriptService";
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

const updateMaphilight = (info: DrawingAreaInfo) => {
    MaphilightService.setup(info.mapImage, true);
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
    updateMaphilight(info);
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

    baseRect.safeRect();

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

const cancelDrawing = () => {
    if (!currentArea) return;

    if (Service.isDrawingEnabled()) {
        currentArea.area.detach();
        MaphilightService.setup(currentArea.mapImage, true);
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
    } else {
        toDrawingBundleColor(currentArea.area);
        DrawingStorageService.saveArea(currentArea);
    }

    updateMaphilight(currentArea);
    currentArea = null;
};

const toDrawingBundleColor = (jqArea: JQuery<HTMLElement>) => {
    jqArea.data("maphilight", { strokeColor: C.DDBColors.green.substr(1) });
};

const toDrawingAreaColor = (jqArea: JQuery<HTMLElement>) => {
    jqArea.data("maphilight", { strokeColor: C.DDBColors.orange.substr(1) });
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
            currentArea.resizeCoords = MaphilightService.rhoToRect(currentArea.startCoords).rectCenter();
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
    if (!currentArea || !Service.isCommandOn(Command.Resize)) return;
    e.preventDefault();
    e.stopPropagation();

    const multiplier = KeyboardService.isShiftOn() ? 10 : 1;

    let delta = e.deltaY > 0 ? -1 : 1;
    if (KeyboardService.isShiftOn()) delta *= 5;

    const baseCoords: Coordinates = currentArea.resizeCoords || currentArea.startCoords;
    const x1 = baseCoords.x(1);
    const y1 = baseCoords.y(1);
    currentArea.resizeCoords = new Coordinates(x1, y1).radius(baseCoords.r + delta);

    // if shift on radius only changes by minimum of 5
    // made after conversion from rect to circ
    if (KeyboardService.isShiftOn() && C.MapAreaCircle === currentArea.shape) {
        DrawingCoordsService.circleRound(currentArea.resizeCoords);
    }

    currentArea.coords = currentArea.resizeCoords.clone();

    redrawArea(currentArea);
};

const mouseMove = (e: MouseEvent) => {
    if (!Service.isAnyCommandOn() || (!isImg(e) && !isArea(e))) return;

    const mouseCoords = DrawingCoordsService.getMouseCoords(e);

    if (!currentArea) {
        DrawingCoordsService.setToolbarCoords(mouseCoords.toString());
    } else if (dragging && (Service.isDrawingEnabled() || Service.isCommandOn(Command.Resize))) {
        currentArea.dragged = true;

        const x1 = (currentArea.resizeCoords || currentArea.startCoords).x(1);
        const y1 = (currentArea.resizeCoords || currentArea.startCoords).y(1);
        const baseRect = new Coordinates(x1, y1).add(mouseCoords.x(1), mouseCoords.y(1));

        currentArea.coords = resizedRectToShape(baseRect);
        redrawArea(currentArea);
    } else if (dragging && Service.isCommandOn(Command.Move)) {
        currentArea.dragged = true;
        currentArea.movingCoords.x(2, mouseCoords.x(1));
        currentArea.movingCoords.y(2, mouseCoords.y(1));
        currentArea.coords = currentArea.startCoords.clone().translate(currentArea.movingCoords);
        redrawArea(currentArea);
    }
};

const mouseOut = (e: MouseEvent) => {
    if (!isImg(e) || DrawingCoordsService.isOverMap(e) || currentArea) return;
    setTimeout(() => DrawingCoordsService.setToolbarCoords("0,0"), 100); // forces execution after throttle
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
        //#region keyboard

        // cancel Drawing
        KeyboardService.down().codes("Escape", "Backspace").noRepeat().handler(cancelDrawing);

        // confirm drawing/delete on enter
        KeyboardService.down().keys("Enter").noRepeat().handler(() => confirmDrawing());

        const keyboardMoveDeltaChart = {
            ArrowLeft: { x: -1, y: 0 },
            ArrowUp: { x: 0, y: -1 },
            ArrowRight: { x: 1, y: 0 },
            ArrowDown: { x: 0, y: 1 }
        };

        // keyboard move with arrows
        KeyboardService.down().codes("ArrowLeft", "ArrowUp", "ArrowRight", "ArrowDown").IF(() => {
            return currentArea && !dragging && Service.isCommandOn(Command.Move);
        }).throttle(100).handler((e: KeyboardEvent) => {
            const delta = keyboardMoveDeltaChart[e.code];
            const multiplier = KeyboardService.isCtrlOn() ? 100 : KeyboardService.isShiftOn() ? 10 : 1;
            if (!currentArea.coords) currentArea.coords = currentArea.startCoords.clone();

            const newCoords = currentArea.coords.clone();
            newCoords.translateWithDelta(multiplier * delta.x, multiplier * delta.y);

            const imageCoords = DrawingCoordsService.getImageCoords(currentArea.mapImage);
            if (newCoords.isInsideRect(imageCoords)) {
                currentArea.coords = newCoords;
                redrawArea(currentArea);
            }
        });

        //#endregion
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