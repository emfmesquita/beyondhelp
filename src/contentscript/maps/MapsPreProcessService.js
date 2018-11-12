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
let preprocessed = new MapRefsPreProcessed();

// adds base path to areas
const preProcessAreas = (areas: MapAreaInfo[], basePath: string) => {
    if (!Array.isArray(areas)) return;
    areas.forEach(area => {
        if (area.page) area.page = basePath + area.page;
    });
};

// finds target map and adds info to area
const preProcesMaptoMaps = (areas: MapAreaInfo[], basePath: string) => {
    if (!Array.isArray(areas)) return;
    areas.forEach(area => {
        if (!(area instanceof MapToMapAreaInfo)) return;
        const mapToMap: MapToMapAreaInfo = area;
        const targetMap = allMaps.find(map => map.mapImageName === mapToMap.targetImageName);
        if (!targetMap) return;
        mapToMap.page = targetMap.preprocessed ? targetMap.page : basePath + targetMap.page;
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
    if (Array.isArray(map.areas)) {
        map.areas.forEach(area => {
            if (area.addBackLinkIfSamePage && (!area.page || area.page === (map.basePath + map.page))) {
                selectors.add("#" + area.headerId);
            }
        });
    }
    if (map.menuHeaderId) selectors.add("#" + map.menuHeaderId);
    if (Array.isArray(map.extraMenuHeaderIds)) {
        map.extraMenuHeaderIds.forEach(menuHeaderId => selectors.add("#" + menuHeaderId));
    }
    extraMapLinkSelectors = extraMapLinkSelectors.concat(Array.from(selectors));

    map.mapLinks = new MapLinksInfo(map.page, map.page, map.contentId, extraMapLinkSelectors);
    pathPreProcessLinks(map.mapLinks, basePath);
};

const preProcessExtraLinks = (mapLinks: MapLinksInfo) => {
    if (mapLinks.targetImageName) {
        const targetMap = allMaps.find(map => map.mapImageName === mapLinks.targetImageName);
        if (!targetMap) return;
        mapLinks.mapContentId = targetMap.contentId;
        mapLinks.toPage = targetMap.page;
    }
    pathPreProcessLinks(mapLinks, mapLinks.basePath);
};

class MapsPreProcessService {
    static reset() {
        allMaps = [];
        preprocessed = new MapRefsPreProcessed();
    }

    /**
     * Register map classes with maps to pre process.
     * @param {*} refsClass 
     */
    static register(refsClass: typeof MapRefs) {
        const path = refsClass.path;
        const shouldPreProcess = path && LocationService.isOnCompendium(path);

        // store path and if is on toc
        if (shouldPreProcess && !preprocessed.path) {
            preprocessed.path = path;
            preprocessed.isOnToc = LocationService.isOnToc(path);
        }

        // register maps to all maps and maps of current page to pre process
        if (Array.isArray(refsClass.maps)) {
            allMaps = allMaps.concat(refsClass.maps);
            if (shouldPreProcess) refsClass.maps.forEach(map => {
                if (map.preprocessed) {
                    preprocessed.maps.push(map);
                } else {
                    // not on toc, not on current chapter, only process map links
                    if (!preprocessed.isOnToc && (!map.page || !LocationService.isOnCompendium(path + map.page))) {
                        map.notFromCurrentChapter = true;
                    }
                    map.basePath = path;
                    preprocessed.maps.push(map);
                }
            });
        }

        // register extra links to pre process
        if (!preprocessed.isOnToc && shouldPreProcess && Array.isArray(refsClass.extraMapLinks)) {
            refsClass.extraMapLinks.forEach(mapLinks => {
                if (mapLinks.preprocessed) {
                    preprocessed.extraMapLinks.push(mapLinks);
                } else {
                    if (!mapLinks.fromPage || !LocationService.isOnCompendium(path + mapLinks.fromPage)) return;
                    mapLinks.basePath = path;
                    preprocessed.extraMapLinks.push(mapLinks);
                }
            });
        }
    }

    /**
     * Pre process registered maps of current page.
     */
    static preProcess(): MapRefsPreProcessed {

        preprocessed.maps.forEach(map => {
            if (preprocessed.isOnToc || map.preprocessed) return;
            if (!map.notFromCurrentChapter) preProcessAreas(map.areas, map.basePath);
            if (!map.notFromCurrentChapter) preProcesMaptoMaps(map.areas, map.basePath);
            preProcessLinks(map, map.basePath);
        });

        if (!preprocessed.isOnToc) preprocessed.extraMapLinks.forEach(preProcessExtraLinks);

        // adds base path at last to not interfere with areas and extra links pre processors
        // also group areas by map image name
        preprocessed.maps.forEach(map => {
            if (!map.preprocessed) {
                map.page = map.basePath + map.page;
                map.preprocessed = true;
            }

            if (!map.mapImageName || !Array.isArray(map.areas) || map.areas.length === 0 || map.notFromCurrentChapter) return;

            let areas = preprocessed.areasByMapImage[map.mapImageName];
            if (!areas) {
                preprocessed.areasByMapImage[map.mapImageName] = [];
                areas = preprocessed.areasByMapImage[map.mapImageName];
            }

            map.areas.forEach(area => {
                area.page = area.page || map.page;
                areas.push(area);
            });
        });

        return preprocessed;
    }

    static hasMapAreas(mapImageName: string): boolean {
        const areas = preprocessed.areasByMapImage[mapImageName];
        return Array.isArray(areas) && areas.length > 0;
    }
}

export default MapsPreProcessService;