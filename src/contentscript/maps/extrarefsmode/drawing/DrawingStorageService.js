import $ from "jquery";
import DrawingAreaInfo from "./DrawingAreaInfo";
import ExtraMapRefsMode from "../ExtraMapRefsMode";
import ExtraMapRefsStorageService from "../../../../services/storage/ExtraMapRefsStorageService";
import MapInfo from "../../MapInfo";
import MapsService from "../../MapsService";

const buildMapInfo = (jqImg: JQuery<HTMLElement>): MapInfo => {
    const mapImageName = MapsService.getMapImageName(jqImg);
    const mapInfo = new MapInfo().image(mapImageName);
    mapInfo.basePath = ExtraMapRefsMode.getPath();
    mapInfo.page = ExtraMapRefsMode.getPage();
    mapInfo.contentId = jqImg.closest("p[data-content-chunk-id]").attr("data-content-chunk-id");
    return mapInfo;
};

class DrawingStorageService {
    static saveArea(info: DrawingAreaInfo) {
        ExtraMapRefsStorageService.saveArea(info, buildMapInfo(info.mapImage));
    }

    static deleteArea(info: DrawingAreaInfo) {
        ExtraMapRefsStorageService.deleteArea(info, buildMapInfo(info.mapImage));
    }
}

export default DrawingStorageService;