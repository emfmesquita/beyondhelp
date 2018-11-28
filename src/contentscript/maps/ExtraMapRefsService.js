import C from "../../Constants";
import Configuration from "../../data/Configuration";
import DrawingColorService from "./extrarefsmode/drawing/DrawingColorService";
import E from "../../services/ErrorService";
import ExtraMapRefsData from "../../data/ExtraMapRefsData";
import LocationService from "../../services/LocationService";
import MapAreaInfo from "./MapAreaInfo";
import MapCommentAreaInfo from "./MapCommentAreaInfo";
import MapInfo from "./MapInfo";
import MapLinksInfo from "./MapLinksInfo";
import MapRefs from "./MapRefs";
import MapToMapAreaInfo from "./MapToMapAreaInfo";
import Opt from "../../Options";

const fourCoordsRegex = /[0-9 ]+,[0-9 ]+,[0-9 ]+,[0-9 ]+/;
const threeCoordsRegex = /[0-9 ]+,[0-9 ]+,[0-9 ]+/;

const onBundle = (bundleName) => `on bundle "${bundleName}"`;
const fromCompendium = (compendium, bundleName: string) => `from "${compendium.path}" ${onBundle(bundleName)}`;
const fromMap = (map, compendium, bundleName: string) => `from "${map.mapImageName}" ${fromCompendium(compendium, bundleName)}`;
const fromExtraLink = (extraLink, compendium, bundleName: string) => `from "${extraLink.selector}" ${fromCompendium(compendium, bundleName)}`;
const isDrawing = (bundle: ExtraMapRefsData, config) => bundle.storageId === config[Opt.ExtraMapRefsDrawingBundle];

const setColor = (info: MapAreaInfo, bundle: ExtraMapRefsData, compendium, map, area, drawable: boolean) => {
    const color = DrawingColorService.calcColor(bundle, compendium, map, area, drawable);
    info.chroma(color, drawable ? DrawingColorService.toHighlightColor(color) : undefined);
};

const processCompendiumMap = (bundle, compendium, map, config) => {
    const mapAreas: MapAreaInfo[] = [];
    const bundleName = bundle.content.name;
    const drawable = isDrawing(bundle, config);

    if (!map.mapImageName) {
        E.log(`Attribute "mapImageName" is missing from a map ${fromCompendium(compendium, bundleName)} and it is required.`);
        return;
    }
    if (!map.page) {
        E.log(`Attribute "page" is missing ${fromMap(map, compendium, bundleName)} and it is required.`);
        return;
    }
    if (!map.contentId) {
        E.log(`Attribute "contentId" is missing ${fromMap(map, compendium, bundleName)} and it is required.`);
        return;
    }
    if (!map.menuHeaderId) {
        E.log(`Attribute "menuHeaderId" is missing ${fromMap(map, compendium, bundleName)} and it is required.`);
        // not returned - maps added by drawing start without menuHeaderId
    }

    // process areas
    if (Array.isArray(map.simpleAreas)) {
        map.simpleAreas.forEach(area => {
            if (!area.coords) {
                E.log(`Attribute "coords" is missing from an area ${fromMap(map, compendium, bundleName)} and it is required.`);
                return;
            }

            if (!fourCoordsRegex.test(area.coords)) {
                E.log(`Attribute "coords" (${area.coords}) from an area ${fromMap(map, compendium, bundleName)} has an invalid format.`);
                return;
            }

            if (!area.headerId && !area.contentId) {
                E.log(`Attributes "headerId" and "contentId" are missing ${fromMap(map, compendium, bundleName)} and at least one is required.`);
                // not returned - areas added by drawing start without headerId and contentId
            }

            E.tryCatch(() => {
                const info = new MapAreaInfo(area.headerId, area.coords, area.page).drawable(drawable).content(area.contentId, area.untilContentId).uid(area.id);
                setColor(info, bundle, compendium, map, area, drawable);
                mapAreas.push(info);
            }, `Failed to process area "${area.coords}" ${fromMap(map, compendium, bundleName)}.`);
        });
    }

    // process extra areas
    if (Array.isArray(map.extraAreas)) {
        map.extraAreas.forEach(extraArea => {
            if (!extraArea.coords) {
                E.log(`Attribute "coords" is missing from an extra area ${fromMap(map, compendium, bundleName)} and it is required.`);
                return;
            }

            if (!fourCoordsRegex.test(extraArea.coords)) {
                E.log(`Attribute "coords" (${extraArea.coords}) from an extra area ${fromMap(map, compendium, bundleName)} has an invalid format.`);
                return;
            }

            if (!extraArea.contentId) {
                E.log(`Attribute "contentId" is missing from an extra area ${fromMap(map, compendium, bundleName)} and it is required.`);
                // not returned - areas added by drawing start without contentId
            }

            E.tryCatch(() => {
                const info = new MapAreaInfo().rhoStr(extraArea.coords).drawable(drawable).fromPage(extraArea.page).content(extraArea.contentId, extraArea.untilContentId).uid(extraArea.id);
                setColor(info, bundle, compendium, map, extraArea, drawable);
                mapAreas.push(info);
            }, `Failed to process extra area "${extraArea.coords}" ${fromMap(map, compendium, bundleName)}.`);
        });
    }

    // process map to maps
    if (Array.isArray(map.mapToMaps)) {
        map.mapToMaps.forEach(mapToMap => {
            if (!mapToMap.coords) {
                E.log(`Attribute "coords" is missing from a map to map area ${fromMap(map, compendium, bundleName)} and it is required.`);
                return;
            }

            if (!threeCoordsRegex.test(mapToMap.coords)) {
                E.log(`Attribute "coords" (${mapToMap.coords}) from map to map area ${fromMap(map, compendium, bundleName)} has an invalid format.`);
                return;
            }

            if (!mapToMap.targetImageName) {
                E.log(`Attribute "targetImageName" is missing from a map to map area ${fromMap(map, compendium, bundleName)} and it is required.`);
                // not returned - areas added by drawing start without targetImageName
            }

            E.tryCatch(() => {
                const info = new MapToMapAreaInfo(mapToMap.targetImageName, mapToMap.coords).drawable(drawable).uid(mapToMap.id);
                setColor(info, bundle, compendium, map, mapToMap, drawable);
                mapAreas.push(info);
            }, `Failed to process map to map area "${mapToMap.coords}" ${fromMap(map, compendium, bundleName)}.`);
        });
    }

    // process comments
    if (Array.isArray(map.comments)) {
        map.comments.forEach(comment => {
            if (!comment.coords) {
                E.log(`Attribute "coords" is missing from a comment area ${fromMap(map, compendium, bundleName)} and it is required.`);
                return;
            }

            if (!fourCoordsRegex.test(comment.coords)) {
                E.log(`Attribute "coords" (${comment.coords}) from a comment area ${fromMap(map, compendium, bundleName)} has an invalid format.`);
                return;
            }

            if (!comment.comment) {
                E.log(`Attributes "comment" is missing from a comment area ${fromMap(map, compendium, bundleName)} and it is required.`);
                // not returned - areas added by drawing start without comment
            }

            E.tryCatch(() => {
                const info = new MapCommentAreaInfo(comment.comment, comment.coords, comment.title).drawable(drawable).uid(comment.id);
                setColor(info, bundle, compendium, map, comment, drawable);
                mapAreas.push(info);
            }, `Failed to process comment area "${comment.coords}" ${fromMap(map, compendium, bundleName)}.`);
        });
    }

    map.areas = mapAreas;
};

const processCompendiumExtraLink = (bundleName: string, compendium, extraLink, extraLinks) => {
    if (!extraLink.selector) {
        E.log(`Attribute "selector" is missing from a map link ${fromCompendium(compendium, bundleName)} and it is required.`);
        return;
    }
    if (!extraLink.page) {
        E.log(`Attribute "page" is missing ${fromExtraLink(extraLink, compendium, bundleName)} and it is required.`);
        return;
    }
    if (!extraLink.targetImageName) {
        E.log(`Attribute "targetImageName" is missing ${fromExtraLink(extraLink, compendium, bundleName)} and it is required.`);
        return;
    }
    extraLinks.push(new MapLinksInfo(extraLink.page).map(extraLink.targetImageName).selector(extraLink.selector));
};

const processCompendium = (bundle, compendium, mapRefs: object[], config) => {
    const bundleName = bundle.content.name;
    const path = compendium.path;

    if (!path) {
        E.log(`There is a compendium without "path" attribute ${onBundle(bundleName)} and it is required.`);
        return;
    }

    if (!LocationService.isOnCompendium(path)) return;

    mapRefs.push(compendium);

    // process maps
    if (!compendium.maps || !Array.isArray(compendium.maps)) {
        compendium.maps = [];
    } else {
        compendium.maps.forEach(map => processCompendiumMap(bundle, compendium, map, config));
    }

    // process extra links
    const extraLinks = [];
    compendium.extraMapLinks = extraLinks;
    if (compendium.extraLinks && Array.isArray(compendium.extraLinks)) {
        compendium.extraLinks.forEach(extraLink => processCompendiumExtraLink(bundleName, compendium, extraLink, extraLinks));
    }
};

const processBundle = (bundle: ExtraMapRefsData, config): object[] => {
    const content = bundle.content;

    if (!content) return [];
    const bundleName = bundle.content.name;

    if (!content.compendiums) {
        E.log(`No "compendiums" found ${onBundle(bundleName)}.`);
        return [];
    }

    const compendiums = content.compendiums;
    if (!Array.isArray(compendiums)) {
        E.log(`Attribute "compendiums" should be an array ${onBundle(bundleName)}.`);
        return [];
    }

    const mapRefs = [];

    // process the compendiums related with the current page and add them to mapRefs
    compendiums.forEach(compendium => processCompendium(bundle, compendium, mapRefs, config));

    return mapRefs;
};

class ExtraMapRefsService {
    static buildMapRefs(bundles: ExtraMapRefsData[], config: Configuration): object[] {
        let mapRefs = [];
        if (!bundles) return mapRefs;

        bundles.forEach(bundle => {
            mapRefs = mapRefs.concat(processBundle(bundle, config));
        });

        return mapRefs;
    }
}

export default ExtraMapRefsService;