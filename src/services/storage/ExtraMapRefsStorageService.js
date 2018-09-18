import C from "../../Constants";
import ConfigStorageService from "./ConfigStorageService";
import DrawingAreaInfo from "../../contentscript/maps/extrarefsmode/drawing/DrawingAreaInfo";
import ExtraMapRefsData from "../../data/ExtraMapRefsData";
import LocalStorageService from "./LocalStorageService";
import MapInfo from "../../contentscript/maps/MapInfo";
import MessageService from "../MessageService";
import Opt from "../../Options";
import Q from "../../services/storage/Q";
import DrawingCoordsService from "../../contentscript/maps/extrarefsmode/drawing/DrawingCoordsService";
//import type StorageData from "../../data/StorageData";

const shapeToAreas = {
    [C.MapAreaRect]: "simpleAreas",
    [C.MapAreaRhombus]: "extraAreas",
    [C.MapAreaCircle]: "mapToMaps"
};

const getDrawingBundle = (): Promise<ExtraMapRefsData> => {
    return ConfigStorageService.getConfig().then(config => {
        return LocalStorageService.getData(config[Opt.ExtraMapRefsDrawingBundle]);
    });
};

const getMap = (bundle: ExtraMapRefsData, mapInfo: MapInfo, createNonExistent: boolean): object => {
    let compendiums: Array = bundle.content.compendiums;
    if (!Array.isArray(compendiums)) {
        if (!createNonExistent) return;
        bundle.content.compendiums = [];
        compendiums = bundle.content.compendiums;
    }

    let compendium = compendiums.find(c => c.path === mapInfo.basePath);
    if (!compendium) {
        if (!createNonExistent) return;
        compendium = { path: mapInfo.basePath };
        compendiums.push(compendium);
    }

    let maps: Array = compendium.maps;
    if (!Array.isArray(maps)) {
        if (!createNonExistent) return;
        compendium.maps = [];
        maps = compendium.maps;
    }

    let map = maps.find(m => m.mapImageName === mapInfo.mapImageName);
    if (!map) {
        if (!createNonExistent) return;
        map = { mapImageName: mapInfo.mapImageName };
        maps.push(map);
    }
    if (!map.page) map.page = mapInfo.page;
    if (!map.contentId) map.contentId = mapInfo.contentId;

    return map;
};

const getAreas = (map: object, shape: string, createNonExistent: boolean): Array => {
    if (!Array.isArray(map[shapeToAreas[shape]]) && createNonExistent) map[shapeToAreas[shape]] = [];
    return map[shapeToAreas[shape]];
};

const sendChangedMessage = () => {
    MessageService.send(C.ExtraMapRefsChangesMessage, {}, ({ tab }) => {
        window.bhTabId = tab.id;
    });
};

class ExtraMapRefsStorageService {

    /**
     * Gets or creates the data from extra map refs of options page.
     */
    static getAll(): Promise<ExtraMapRefsData[]> {
        return LocalStorageService.getStorageData().then((storageData: StorageData) => {
            return LocalStorageService.find(storageData, Q.clazz("ExtraMapRefsData"));
        });
    }

    static get(storageId: string): Promise<ExtraMapRefsData> {
        return LocalStorageService.getData(storageId);
    }

    /**
     * Updates the data from extra map refs of options page.
     * @param {*} content 
     */
    static save(bundle: ExtraMapRefsData): Promise {
        return LocalStorageService.createData("ExtraMapRefsData", bundle);
    }

    static delete(bundle: ExtraMapRefsData): Promise<ExtraMapRefsData> {
        return LocalStorageService.deleteData(bundle);
    }

    static saveArea(areaInfo: DrawingAreaInfo, mapInfo: MapInfo): Promise {
        return getDrawingBundle().then(bundle => {
            const map = getMap(bundle, mapInfo, true);
            const areas = getAreas(map, areaInfo.shape, true);
            const oldArea = areas.find(a => a.id === areaInfo.id);
            const saveCoords = DrawingCoordsService.toSaveCoords(areaInfo.coords, areaInfo.shape).toString();

            if (oldArea) {
                oldArea.coords = saveCoords;
            } else {
                areas.push({
                    id: areaInfo.id,
                    coords: saveCoords
                });
            }

            return ExtraMapRefsStorageService.save(bundle);
        }).then(sendChangedMessage);
    }

    static deleteArea(areaInfo: DrawingAreaInfo, mapInfo: MapInfo): Promise {
        return getDrawingBundle().then(bundle => {
            const map = getMap(bundle, mapInfo, true);
            if (!map) return;

            const areas = getAreas(map, areaInfo.shape);
            if (!Array.isArray(areas)) return;

            const idx = areas.findIndex(a => a.id === areaInfo.id);
            if (idx === -1) return;

            areas.splice(idx, 1);

            return ExtraMapRefsStorageService.save(bundle);
        }).then(sendChangedMessage);
    }
}

export default ExtraMapRefsStorageService;