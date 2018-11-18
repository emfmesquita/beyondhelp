import { FragmentData, FragmentService } from "../../services/FragmentService";
import React, { Component } from 'react';

import $ from "jquery";
import ConfigStorageService from "../../services/storage/ConfigStorageService";
import Configuration from "../../data/Configuration";
import DrawingColorService from "./extrarefsmode/drawing/DrawingColorService";
import E from "../../services/ErrorService";
import ExtraMapRefsData from "../../data/ExtraMapRefsData";
import ExtraMapRefsService from "./ExtraMapRefsService";
import ExtraMapRefsStorageService from "../../services/storage/ExtraMapRefsStorageService";
import HeaderToolbarService from "../../services/HeaderToolbarService";
import LocationService from "../../services/LocationService";
import MapAreaInfo from "./MapAreaInfo";
import MapAreas from "./MapAreas";
import MapInfo from "./MapInfo";
import MapLink from "./MapLink";
import MapLinksColisionHandler from "./MapLinksColision";
import MapLinksInfo from "./MapLinksInfo";
import MapMenuLink from "./MapMenuLink";
import MapRefs from "./MapRefs";
import MapRefsPreProcessed from "./MapRefsPreProcessed";
import MapsHotDQ from "./compendiums/MapsHotDQ";
import MapsLMoP from "./compendiums/MapsLMoP";
import MapsOotA from "./compendiums/MapsOotA";
import MapsPotA from "./compendiums/MapsPotA";
import MapsPreProcessService from "./MapsPreProcessService";
import MapsRoT from "./compendiums/MapsRoT";
import MapsTftYP from "./compendiums/MapsTftYP";
import MapsToA from "./compendiums/MapsToA";
import Opt from "../../Options";
import PageScriptService from "../../services/PageScriptService";
import PaperMapService from "../../services/PaperMapService";
import ReactDOM from 'react-dom';
import TooltipsService from "../tooltips/TooltipsService";

const fromMapMsg = (map) => map ? `for map "${map.mapImageName}" from compendium "${map.basePath}"` : "";
let drawingBundleId = null;

const containers: HTMLElement[] = [];
let mapLinksColision = new MapLinksColisionHandler();

// creates both map refs and map links
const processMapRefs = function (mapRefs: MapRefsPreProcessed, config: Configuration) {
    const maps = mapRefs.maps;
    const extraMapLinks = mapRefs.extraMapLinks;

    if (maps && maps.length > 0) {
        // is on toc
        if (mapRefs.isOnToc) {
            if (config[Opt.MapTocLinks]) processTocMapLinks(maps);
            return;
        }

        // map areas
        Object.keys(mapRefs.areasByMapImage).forEach(mapImageName => {
            const jqMapImg = MapsService.getMapImage(mapImageName);
            if (jqMapImg.length === 0) return;

            const areas: MapAreaInfo[] = mapRefs.areasByMapImage[mapImageName];
            renderMapAreas(jqMapImg, mapImageName, areas, config);
        });

        // map links already defined on maps + map menu links
        maps.forEach(map => processMap(map, config));
    }

    // extra map links 
    if (!mapRefs.isOnToc && extraMapLinks && config[Opt.MapLinks]) extraMapLinks.forEach(processMapLinks);
};

// adds a menu map link before a target anchor
const addMenuMapLink = function (map: MapInfo, targetSelector: string, tocLink: boolean, notFoundMsg: string, errorMsg: string) {
    E.tryCatch(() => {
        // checks for colision - avoids rendering same link twice (from different bundles)
        if (mapLinksColision.check(targetSelector, map.mapImageName)) return;

        const jqTargetAnchor = $(targetSelector);
        if (jqTargetAnchor.length === 0) {
            E.log(notFoundMsg);
            return;
        }

        const jqLinkContainer = $("<span class='BH-map-link-container'></span>");
        jqTargetAnchor.after(jqLinkContainer);
        const linkContainer = jqLinkContainer[0];
        containers.push(linkContainer);

        ReactDOM.render(<MapMenuLink map={map} tocLink={tocLink} />, linkContainer);
    }, errorMsg);
};

// add links to maps on toc
const processTocMapLinks = function (maps: MapInfo[]) {
    // reversed because links are added with before, so if there is more than one link they still will be in order
    maps.reverse().forEach(map => {
        if (map.tocHeaderSelector) {
            addMenuMapLink(map, map.tocHeaderSelector, true,
                `TOC header with selector "${map.tocHeaderSelector}" not found ${fromMapMsg(map)}.`,
                `Unable to add TOC map link with selector "${map.tocHeaderSelector}" ${fromMapMsg(map)}.`
            );
            return;
        }

        const headerId = map.tocHeaderId || map.menuHeaderId;
        const selector = `.article-main a[href$='${map.isChapterMap ? map.page : "#" + headerId}']`;
        const msg = map.isChapterMap ? `for page "${map.page}"` : `with id "${headerId}"`;
        addMenuMapLink(map, selector, true,
            `TOC header ${msg} not found ${fromMapMsg(map)}.`,
            `Unable to add TOC map link ${msg} ${fromMapMsg(map)}.`
        );

        if (!Array.isArray(map.extraMenuHeaderIds)) return;
        map.extraMenuHeaderIds.forEach(headerId => {
            addMenuMapLink(map, selector, true,
                `TOC header with id "${headerId}" not found ${fromMapMsg(map)}.`,
                `Unable to add TOC map link with id "${headerId}" ${fromMapMsg(map)}.`
            );
        });
    });
};

// adds links to maps on page menu
const innerProcessMenuMapLink = function (map: MapInfo, headerId: string) {
    if (!headerId) return;

    const anchorSelector = map.notFromCurrentChapter ? `a[href$='${map.page}#${headerId}']` : `a[href='#${headerId}']`;
    const selector = `.quick-menu.quick-menu-tier-1 ${anchorSelector}, .quick-menu.quick-menu-tier-2 ${anchorSelector}`;
    addMenuMapLink(map, selector, false,
        `Menu header with id "${headerId}" not found ${fromMapMsg(map)}.`,
        `Unable to add menu map link with header id "${headerId}" ${fromMapMsg(map)}.`
    );
};

// adds links to maps on page menu
const processMenuMapLink = function (map: MapInfo) {
    innerProcessMenuMapLink(map, map.menuHeaderId);

    if (!Array.isArray(map.extraMenuHeaderIds)) return;
    map.extraMenuHeaderIds.forEach(menuHeaderId => innerProcessMenuMapLink(map, menuHeaderId));
};

// add a hoverable tooltip link to a map for every target with the corresponding selector
const processMapLinks = function (mapLinks: MapLinksInfo, map: MapInfo) {
    if (!mapLinks || !mapLinks.targetSelectors) return;

    mapLinks.targetSelectors.forEach(selector => {
        const jqHeader = $(selector);
        if (jqHeader.length === 0) {
            E.log(`Header with selector "${selector}" not found ${fromMapMsg(map)}.`);
            return;
        }

        const linkContainer = HeaderToolbarService.mapLinkButtonContainer(jqHeader);
        containers.push(linkContainer);

        E.tryCatch(() => {
            ReactDOM.render(<MapLink info={mapLinks} />, linkContainer);
        }, `Failed to render map link to header with selector "${selector}" ${fromMapMsg(map)}.`);
    });
};

// creates the map links already defined on maps + map menu links
const processMap = function (map: MapInfo, config: Configuration) {
    // checks if map found
    if (!map.notFromCurrentChapter && MapsService.getMapImage(map.mapImageName).length === 0) {
        E.log(`Map with file name "${map.mapImageName}" not found.`);
        return;
    }

    // renders a link to the map on menu
    if (config[Opt.MapMenuLinks]) processMenuMapLink(map);

    // renders links to map on headers both from defined areas and extra links
    if (config[Opt.MapLinks] && !map.notFromCurrentChapter) processMapLinks(map.mapLinks);
};

const renderMapAreas = (jqMapImg: JQuery<HTMLElement>, mapImageName: string, areas: MapAreaInfo[], config: Configuration) => {
    jqMapImg.attr("usemap", `#${mapImageName}`);
    const jqMapContainer = jqMapImg.parent();
    const areasContainer = document.createElement("div");
    jqMapContainer.append(areasContainer);
    containers.push(areasContainer);

    E.tryCatch(() => {
        const setupPaper = () => PaperMapService.setupMap(jqMapImg, !!drawingBundleId);
        ReactDOM.render(<MapAreas mapImageName={mapImageName} areas={areas} config={config} />, areasContainer, setupPaper);
    }, `Failed to render areas from map "${mapImageName}".`);
};

const scrollToContentIdReference = function () {
    const data = FragmentService.parse(window.location.hash);
    if (!data) return;
    const jqTarget = data.contentId ? $(`[data-content-chunk-id='${data.contentId}']`) : $(`#${data.id}`);
    if (jqTarget.length === 0) return;
    jqTarget[0].scrollIntoView();
};

const load = (config: Configuration): Promise => {
    return ExtraMapRefsStorageService.getAll().then(bundles => {
        const compendiumsToLoad = [];
        if (config[Opt.BhMapRefsLMoP]) compendiumsToLoad.push(MapsLMoP);
        if (config[Opt.BhMapRefsHotDQ]) compendiumsToLoad.push(MapsHotDQ);
        if (config[Opt.BhMapRefsRoT]) compendiumsToLoad.push(MapsRoT);
        if (config[Opt.BhMapRefsPotA]) compendiumsToLoad.push(MapsPotA);
        if (config[Opt.BhMapRefsOotA]) compendiumsToLoad.push(MapsOotA);
        if (config[Opt.BhMapRefsTftYP]) compendiumsToLoad.push(MapsTftYP);
        if (config[Opt.BhMapRefsToA]) compendiumsToLoad.push(MapsToA);

        // register all coded maps to pre process
        compendiumsToLoad.forEach(MapsPreProcessService.register);

        // create map refs from bundles of options page and add them to preprocess
        ExtraMapRefsService.buildMapRefs(bundles, config).forEach(mapRefs => {
            MapsPreProcessService.register(mapRefs);
        });

        // renders map areas and map links
        processMapRefs(MapsPreProcessService.preProcess(), config);

        if (!!drawingBundleId) {
            // if drawing calculates the drawing color for maps of current page
            DrawingColorService.init(config, bundles);

            // if drawing on a bundle render paperjs for images not used
            // to allow drawing on them
            $(".primary-content .ddb-lightbox-outer img").each((idx, img) => {
                const jqImg = $(img);
                const imageName = MapsService.getMapImageName(jqImg);
                if (MapsPreProcessService.hasMapAreas(imageName)) return;
                renderMapAreas(jqImg, imageName, [], config);
            });
        }
    });
};

const unload = () => {
    // unmounts all map areas and map links
    containers.forEach(container => {
        ReactDOM.unmountComponentAtNode(container);
        // removes container if it is not map link container
        // (map link containers are handled by HeaderToolbarService)
        if (!container.classList.contains("BH-map-link-container")) {
            container.parentNode.removeChild(container);
        }
    });
    containers.length = 0;
    mapLinksColision = new MapLinksColisionHandler();

    // unload the maphiligts
    $(".primary-content .ddb-lightbox-outer img").each((idx, img) => {
        PaperMapService.unload($(img));
    });

    // resets the preprocessing
    MapsPreProcessService.reset();
};

class MapsService {
    static init(config: Configuration) {
        if (!LocationService.isOnCompendium("")) return;

        drawingBundleId = config[Opt.ExtraMapRefsDrawingBundle];

        load(config).then(() => {
            // listen hash changes to scroll to refs with contentId
            window.addEventListener("hashchange", scrollToContentIdReference, false);
            // scroll to ref with contentId
            scrollToContentIdReference();
        });
    }

    static reload(config: Configuration) {
        if (!LocationService.isOnCompendium("")) return;

        const newDrawingBundleId = config[Opt.ExtraMapRefsDrawingBundle];

        // drawing toggle requires a window reload
        if (!newDrawingBundleId && drawingBundleId || newDrawingBundleId && !drawingBundleId) {
            window.location.reload();
            return;
        }

        ExtraMapRefsStorageService.getAll().then(bundles => {
            let hasToSoftReload = false;

            // drawing bundle changed requires soft reload
            if (newDrawingBundleId !== drawingBundleId) hasToSoftReload = true;

            // if not - checks if current compendium is on any bundle
            // if so needs a soft reload
            if (!hasToSoftReload && Array.isArray(bundles)) {
                bundles.forEach(bundle => {
                    if (hasToSoftReload || !Array.isArray(bundle.content.compendiums)) return;
                    bundle.content.compendiums.forEach(compendium => {
                        if (hasToSoftReload) return;
                        if (compendium.path && LocationService.isOnCompendium(compendium.path)) hasToSoftReload = true;
                    });
                });
            }

            // no soft reload needed - nothing to do
            if (!hasToSoftReload) return;

            // soft reloads
            unload();
            load(config).then(() => TooltipsService.bhTooltipsInit());
        });
    }

    static getMapImageName(jqMapImg: JQuery<HTMLElement>): string {
        const imgSrc = jqMapImg.attr("src");
        return imgSrc.substr(imgSrc.lastIndexOf("/") + 1);
    }

    static getMapImage(mapImageName: string): JQuery<HTMLElement> {
        return $(`img[src$='/${mapImageName}']`);
    }
}

export default MapsService;
