import E from "../../services/ErrorService";
import FormMapRefsData from "../../data/FormMapRefsData";
import LocationService from "../../services/LocationService";
import MapAreaInfo from "./MapAreaInfo";
import MapInfo from "./MapInfo";
import MapRefs from "./MapRefs";
import MapToMapAreaInfo from "./MapToMapAreaInfo";
import C from "../../Constants";

const defaultColor = C.DDBColors.green;

const fourCoordsRegex = /[0-9 ]+,[0-9 ]+,[0-9 ]+,[0-9 ]+/;
const threeCoordsRegex = /[0-9 ]+,[0-9 ]+,[0-9 ]+/;

const processCompendiumMap = (compendium, map) => {
    const mapAreas: MapAreaInfo[] = [];

    if (!map.mapImageName) {
        E.log(`Attribute "mapImageName" is missing from a map from "${compendium.path}" and it is required.`);
        return;
    }
    if (!map.page) {
        E.log(`Attribute "page" is missing from "${map.mapImageName}" from compendium "${compendium.path}" and it is required.`);
        return;
    }
    if (!map.contentId) {
        E.log(`Attribute "contentId" is missing from "${map.mapImageName}" from compendium "${compendium.path}" and it is required.`);
        return;
    }
    if (!map.menuHeaderId) {
        E.log(`Attribute "menuHeaderId" is missing from "${map.mapImageName}" from compendium "${compendium.path}" and it is required.`);
        return;
    }

    // process areas
    if (map.areas && Array.isArray(map.areas)) {
        map.areas.forEach(area => {
            if (!area.coords) {
                E.log(`Attribute "coords" is missing from an area from "${map.mapImageName}" from compendium "${compendium.path}" and it is required.`);
                return;
            }

            if (!fourCoordsRegex.test(area.coords)) {
                E.log(`Attribute "coords" (${area.coords}) from an area from "${map.mapImageName}" from compendium "${compendium.path}" has an invalid format.`);
                return;
            }

            if (!area.headerId && !area.contentId) {
                E.log(`Attributes "headerId" and "contentId" are missing from "${map.mapImageName}" from compendium "${compendium.path}" and at least one is required.`);
                return;
            }

            E.tryCatch(() => {
                mapAreas.push(new MapAreaInfo(area.headerId, area.coords, area.page, area.contentId).chroma(defaultColor));
            }, `Failed to process area (${area.coords}) from map (${map.mapImageName}) from ${compendium.path}.`);
        });
    }

    // process extra areas
    if (map.extraAreas && Array.isArray(map.extraAreas)) {
        map.extraAreas.forEach(extraArea => {
            if (!extraArea.coords) {
                E.log(`Attribute "coords" is missing from an extra area from "${map.mapImageName}" from compendium "${compendium.path}" and it is required.`);
                return;
            }

            if (!fourCoordsRegex.test(extraArea.coords)) {
                E.log(`Attribute "coords" (${extraArea.coords}) from an extra area from "${map.mapImageName}" from compendium "${compendium.path}" has an invalid format.`);
                return;
            }

            if (!extraArea.contentId) {
                E.log(`Attribute "contentId" is missing from an extra area from "${map.mapImageName}" from compendium "${compendium.path}" and it is required.`);
                return;
            }

            E.tryCatch(() => {
                mapAreas.push(new MapAreaInfo().rhoStr(extraArea.coords).content(extraArea.contentId).chroma(defaultColor));
            }, `Failed to process extra area (${extraArea.coords}) from map (${map.mapImageName}) from ${compendium.path}.`);
        });
    }

    // process map to maps
    if (map.mapToMaps && Array.isArray(map.mapToMaps)) {
        map.mapToMaps.forEach(mapToMap => {
            if (!mapToMap.coords) {
                E.log(`Attribute "coords" is missing from a map to map area from "${map.mapImageName}" from compendium "${compendium.path}" and it is required.`);
                return;
            }

            if (!threeCoordsRegex.test(mapToMap.coords)) {
                E.log(`Attribute "coords" (${mapToMap.coords}) from map to map area from "${map.mapImageName}" from compendium "${compendium.path}" has an invalid format.`);
                return;
            }

            if (!mapToMap.targetImageName) {
                E.log(`Attribute "targetImageName" is missing from a map to map area from "${map.mapImageName}" from compendium "${compendium.path}" and it is required.`);
                return;
            }

            E.tryCatch(() => {
                mapAreas.push(new MapToMapAreaInfo(mapToMap.targetImageName, mapToMap.coords).chroma(defaultColor));
            }, `Failed to process map to map area (${mapToMap.coords}) from map (${map.mapImageName}) from ${compendium.path}.`);
        });
    }

    map.areas = mapAreas;

    // process map links
    if (map.extraLinks && Array.isArray(map.extraLinks)) {
        map.extraMapLinkSelectors = map.extraLinks;
    }
};

const processCompendium = (compendium, mapRefs: object[]) => {
    const path = compendium.path;

    if (!path) {
        E.log(`There is a compendium without "path" attribute and it is required.`);
        return;
    }

    if (!LocationService.isOnCompendium(path)) return;

    mapRefs.push(compendium);

    if (!compendium.maps || !Array.isArray(compendium.maps)) {
        compendium.maps = [];
        return;
    }

    compendium.maps.forEach(map => processCompendiumMap(compendium, map));
};

class FormMapsService {
    static buildMapRefs(formMapRefsData: FormMapRefsData): object[] {
        if (!formMapRefsData.content) return [];
        let formMapRefs = "";

        const result = E.tryCatch(() => {
            formMapRefs = JSON.parse(formMapRefsData.content);
        }, "Failed to parse extra map references json.");
        if (!result) return [];

        if (!formMapRefs.compendiums) {
            E.log(`Attribute "compendiums" not found or empty on extra map references json.`);
            return [];
        }
        const compendiums = formMapRefs.compendiums;
        if (!Array.isArray(compendiums)) {
            E.log(`Attribute "compendiums" should be an array.`);
            return [];
        }

        const mapRefs = [];

        // process the compendiums related with the current page and add them to mapRefs
        compendiums.forEach(compendium => processCompendium(compendium, mapRefs));

        return mapRefs;
    }
}

export default FormMapsService;