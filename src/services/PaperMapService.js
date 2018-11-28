import { PaperScope, Path, Point, Rectangle, Color } from 'paper';
import $ from "jquery";
import C from '../Constants';

const AREA_DATA_ATTR = "bh-paper-data";
const paperScopeCache = {};

const toNumberArray = (stringArray) => stringArray.map(string => Number.parseInt(string));
// uses the same attr used to map areas to the image
const getMapName = (jqMapImg: JQuery<HTMLElement>) => jqMapImg.attr("usemap").substr(1);

/**
 * Changes the color of a paperjs path (stroke and fill).
 * @param {*} path 
 */
const applyColor = (path: Path, color: string) => {
    path.strokeColor = new Color(color);
    const fill = new Color(color);
    fill.alpha = 0.2;
    path.fillColor = fill;
};

const drawArea = (paper: PaperScope, jqArea: JQuery<HTMLElement>) => {
    const coords = jqArea.attr("coords");
    const areaType = jqArea.attr("type");

    let splited = coords.split(",");
    // validates the coordinates length for each area type
    if (areaType === C.MapAreaRect && splited.length !== 4) return;
    if (areaType === C.MapAreaRhombus && splited.length !== 8) return;
    if (areaType === C.MapAreaCircle && splited.length !== 3) return;
    if (areaType === C.MapAreaComment && splited.length !== 14) return;

    splited = toNumberArray(splited);

    // removes old item and creates another
    const props = PaperMapService.getAreaData(jqArea) || {};
    if (props.paperId) {
        const item = paper.project.activeLayer.children.find(child => child.id === props.paperId);
        if (item) item.remove();
    }

    let path = null;
    if (areaType === C.MapAreaCircle) { // circle
        const center = new Point(splited[0], splited[1]);
        path = new Path.Circle(center, splited[2]);
    } else if (areaType === C.MapAreaRect) { // rect
        const p1 = new Point(splited[0], splited[1]);
        const p2 = new Point(splited[2], splited[3]);
        const rect = new Rectangle(p1, p2);
        path = new Path.Rectangle(rect);
    } else { // rho or comment
        path = new Path();
        for (let i = 0; i < splited.length; i += 2) {
            path.add(new Point(splited[i], splited[i + 1]));
        }
        path.closed = true;
    }

    const defaultColor = props.color || "black";
    applyColor(path, defaultColor);
    path.strokeWidth = 2;

    PaperMapService.setAreaData(jqArea, "paperId", path.id);

    // if not always on (normal mode) only shows the area that mouse is over
    if (!paper.alwaysOn) {
        jqArea.hover(() => {
            paper.project.activeLayer.children.forEach(child => child.visible = false);
            path.visible = true;
        }, () => {
            paper.project.activeLayer.children.forEach(child => child.visible = true);
        });
    }

    // if there is a highligh color applies it on mouse over area
    if (props.highlightColor) {
        jqArea.hover(() => applyColor(path, props.highlightColor), () => applyColor(path, defaultColor));
    }
};

// get scope from cache and activates it
const getPaperScope = (jqMapImg: JQuery<HTMLElement>): PaperScope => {
    const mapName = getMapName(jqMapImg);
    if (!paperScopeCache[mapName]) return null;

    const paper: PaperScope = paperScopeCache[mapName];
    paper.activate();
    return paper;
};

const drawAll = (paper: PaperScope, jqMapImg: JQuery<HTMLElement>) => {
    const mapName = getMapName(jqMapImg);
    const mapData = $(`map[name="${mapName}"]`);
    if (mapData.length === 0) return;

    const areas = mapData.find("area");
    areas.each((idx, area) => drawArea(paper, $(area)));
};

class PaperMapService {
    /**
     * Setup a map image paper rendering.
     * @param {*} jqMapImg jquery of map image.
     * @param {*} alwaysOn if areas should be always on (drawing mode)
     */
    static setupMap(jqMapImg: JQuery<HTMLElement>, alwaysOn: boolean) {
        const mapName = getMapName(jqMapImg);
        if (paperScopeCache[mapName]) return;

        // if image not loaded sets a timeout to try again later
        const mapWidth = jqMapImg.width();
        const mapHeight = jqMapImg.height();
        if (!mapWidth || !mapHeight) {
            setTimeout(() => PaperMapService.setupMap(jqMapImg), 200);
            return;
        }

        const mapParent = jqMapImg.parent();

        const mapSiblings = mapParent.children();

        const container = $("<div></div>");
        container.css("width", mapWidth + "px");
        container.css("height", mapHeight + "px");
        container.css("background-image", `url(${jqMapImg.attr("src")})`);
        container.attr("class", jqMapImg.attr("class"));
        container.addClass("BH-map-container");

        const canvas = $(`<canvas width="${jqMapImg.width()}" height="${jqMapImg.height()}"></canvas>`);
        canvas.css("opacity", alwaysOn ? "1" : "1e-10");
        if (!alwaysOn) mapParent.hover(() => canvas.css("opacity", "1"), () => canvas.css("opacity", "1e-10"));

        container.append(canvas);
        container.append(mapSiblings);
        mapParent.append(container);

        const paper = new PaperScope();
        paperScopeCache[mapName] = paper;
        paper.setup(canvas[0]);
        paper.alwaysOn = alwaysOn;
        drawAll(paper, jqMapImg);
    }

    /**
     * Unloads paper rendering for a map image.
     * @param {*} jqMapImg 
     */
    static unload(jqMapImg: JQuery<HTMLElement>) {
        const container = jqMapImg.closest(".BH-map-container");
        if (container.length === 0) return;

        const originalParent = container.parent();
        const canvas = container.find("canvas");
        canvas.detach();
        container.detach();

        originalParent.append(container.children());
        const mapName = getMapName(jqMapImg);
        delete paperScopeCache[mapName];
    }

    /**
     * Render all areas of a map.
     * @param {*} jqMapImg 
     */
    static drawAll(jqMapImg: JQuery<HTMLElement>) {
        const paper = getPaperScope(jqMapImg);
        if (paper) drawAll(paper, jqMapImg);
    }

    /**
     * Redraw a single area of a map.
     * @param {*} jqMapImg 
     * @param {*} jqArea 
     */
    static redrawArea(jqMapImg: JQuery<HTMLElement>, jqArea: JQuery<HTMLElement>) {
        const paper = getPaperScope(jqMapImg);
        if (paper) drawArea(paper, jqArea);
    }

    /**
     * Removes a rendered area of a map.
     * @param {*} jqMapImg 
     * @param {*} jqArea 
     */
    static removeArea(jqMapImg: JQuery<HTMLElement>, jqArea: JQuery<HTMLElement>) {
        const paper = getPaperScope(jqMapImg);
        if (!paper) return;

        const paperId = PaperMapService.getAreaData(jqArea).paperId;
        if (paperId) {
            const item = paper.project.activeLayer.children.find(child => child.id === paperId);
            if (item) item.remove();
        }
    }

    static setAreaData(jqArea: JQuery<HTMLElement>, key: string, value) {
        const stringData = jqArea.attr(AREA_DATA_ATTR);
        const data = stringData ? JSON.parse(stringData) : {};
        data[key] = value;
        jqArea.attr(AREA_DATA_ATTR, JSON.stringify(data));
    }

    static getAreaData(jqArea: JQuery<HTMLElement>) {
        const stringData = jqArea.attr(AREA_DATA_ATTR);
        return stringData ? JSON.parse(stringData) : {};
    }
}

export default PaperMapService;