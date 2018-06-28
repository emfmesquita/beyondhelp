import LocationService from "../../services/LocationService";
import MapAreaInfo from "./MapAreaInfo";
import MapInfo from "./MapInfo";
import MapLinksInfo from "./MapLinksInfo";
import MapRefs from "./MapRefs";
import MapRefsPreProcessed from "./MapRefsPreProcessed";
import MapToMapAreaInfo from "./MapToMapAreaInfo";

// used only on map to map pre process to find target maps on other pages
let allMaps: MapInfo[] = [];

// preprocessed data of current page only
const toPreProcess = new MapRefsPreProcessed();

// adds base path to areas
const preProcessAreas = (areas: MapAreaInfo[], basePath: string) => {
    if (!areas || !Array.isArray(areas)) return;
    areas.forEach(area => {
        if (area.page) area.page = basePath + area.page;
    });
};

// finds target map and adds info to area
const preProcesMaptoMaps = (areas: MapAreaInfo[], basePath: string) => {
    if (!areas || !Array.isArray(areas)) return;
    areas.forEach(area => {
        if (!(area instanceof MapToMapAreaInfo)) return;
        const mapToMap: MapToMapAreaInfo = area;
        const targetMap = allMaps.find(map => map.mapImageName === mapToMap.targetImageName);
        if (!targetMap) return;
        mapToMap.page = basePath + targetMap.page;
        mapToMap.contentId = targetMap.contentId;
    });
};

// adds base path to links
const pathPreProcessLinks = (links: MapLinksInfo, basePath: string) => {
    if (!links) return;
    links.fromPage = basePath + links.fromPage;
    links.toPage = basePath + links.toPage;
};


// Joins areas header ids with extra link selectors and creates map links info.
// Later used to render links on headers to go back to map.
const preProcessLinks = (map: MapInfo, basePath: string): MapLinksInfo => {
    let extraMapLinkSelectors = map.extraMapLinkSelectors || [];

    const selectors: Set<string> = new Set(); // set to avoind repetitions
    if (map.areas && Array.isArray(map.areas)) {
        map.areas.forEach(area => area.addBackLink && selectors.add("#" + area.headerId));
    }
    if (map.menuHeaderId) selectors.add("#" + map.menuHeaderId);
    if (map.extraMenuHeaderIds && Array.isArray(map.extraMenuHeaderIds)) {
        map.extraMenuHeaderIds.forEach(menuHeaderId => selectors.add("#" + menuHeaderId));
    }
    extraMapLinkSelectors = extraMapLinkSelectors.concat(Array.from(selectors));

    map.mapLinks = new MapLinksInfo(map.page, map.page, map.contentId, extraMapLinkSelectors);
    pathPreProcessLinks(map.mapLinks, basePath);
};

class MapsPreProcessService {
    /**
     * Register map classes with maps to pre process.
     * @param {*} refsClass 
     */
    static register(refsClass: typeof MapRefs) {
        const path = refsClass.path;
        const shouldPreProcess = path && LocationService.isOnCompendium(path);

        // store path and if is on toc
        if (shouldPreProcess && !toPreProcess.path) {
            toPreProcess.path = path;
            toPreProcess.isOnToc = LocationService.isOnToc(path);
        }

        // register maps to all maps and maps of current page to pre process
        if (refsClass.maps && Array.isArray(refsClass.maps)) {
            allMaps = allMaps.concat(refsClass.maps);
            if (shouldPreProcess) refsClass.maps.forEach(map => {
                if (!toPreProcess.isOnToc && (!map.page || !LocationService.isOnCompendium(path + map.page))) return;
                map.basePath = path;
                toPreProcess.maps.push(map);
            });
        }

        // register extra links to pre process
        if (!toPreProcess.isOnToc && shouldPreProcess && refsClass.extraMapLinks && Array.isArray(refsClass.extraMapLinks)) {
            refsClass.extraMapLinks.forEach(mapLinks => {
                if (!mapLinks.fromPage || !LocationService.isOnCompendium(path + mapLinks.fromPage)) return;
                mapLinks.basePath = path;
                toPreProcess.extraMapLinks.push(mapLinks);
            });
        }
    }

    /**
     * Pre process registered maps of current page.
     */
    static preProcess(): MapRefsPreProcessed {
        toPreProcess.maps.forEach(map => {
            if (toPreProcess.isOnToc) return;
            preProcessAreas(map.areas, map.basePath);
            preProcesMaptoMaps(map.areas, map.basePath);
            preProcessLinks(map, map.basePath);
        });

        // adds base path at last to not interfere with areas pre processor
        toPreProcess.maps.forEach(map => {
            map.page = map.basePath + map.page;
        });

        if (!toPreProcess.isOnToc) toPreProcess.extraMapLinks.forEach(mapLink => pathPreProcessLinks(mapLink, mapLink.basePath));

        return toPreProcess;
    }
}

export default MapsPreProcessService;