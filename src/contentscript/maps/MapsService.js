import "maphilight";

import { FragmentData, FragmentService } from "../../services/FragmentService";
import React, { Component } from 'react';

import $ from "jquery";
import ConfigStorageService from "../../services/storage/ConfigStorageService";
import Configuration from "../../data/Configuration";
import E from "../../services/ErrorService";
import FormMapRefsData from "../../data/FormMapRefsData";
import FormMapsService from "./FormMapsService";
import LocationService from "../../services/LocationService";
import MapAreaInfo from "./MapAreaInfo";
import MapAreas from "./MapAreas";
import MapInfo from "./MapInfo";
import MapLink from "./MapLink";
import MapLinksInfo from "./MapLinksInfo";
import MapMenuLink from "./MapMenuLink";
import MapRefs from "./MapRefs";
import MapRefsPreProcessed from "./MapRefsPreProcessed";
import MapsCoS from "./compendiums/MapsCoS";
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
import ReactDOM from 'react-dom';
import ReferencesUtils from "../../services/ReferencesUtils";

const fromMapMsg = (map) => `for map "${map.mapImageName}" from compendium "${map.basePath}"`;

// creates both map refs and map links
const processMapRefs = function (mapRefs: MapRefsPreProcessed, config: Configuration) {
    const maps = mapRefs.maps;
    const extraMapLinks = mapRefs.extraMapLinks;

    if (!maps || maps.length === 0) return;

    // is on toc
    if (mapRefs.isOnToc) {
        if (config[Opt.MapTocLinks]) processTocMapLinks(maps);
        return;
    }

    // map areas + map links already defined on maps + map menu links
    maps.forEach(map => processMap(map, config));

    // extra map links 
    if (extraMapLinks && config[Opt.MapLinks]) extraMapLinks.forEach(processMapLinks);
};

// adds a menu map link before a target anchor
const addMenuMapLink = function (map: MapInfo, jqTargetAnchor: JQuery<HTMLElement>, tocLink: boolean, notFoundMsg: string, errorMsg: string) {
    E.tryCatch(() => {
        if (jqTargetAnchor.length === 0) {
            E.log(notFoundMsg);
            return;
        }

        const jqLinkContainer = $("<span class='BH-map-link-container'></span>");
        tocLink ? jqTargetAnchor.after(jqLinkContainer) : jqTargetAnchor.before(jqLinkContainer);
        ReactDOM.render(<MapMenuLink map={map} tocLink={tocLink} />, jqLinkContainer[0]);
    }, errorMsg);
};

// add links to maps on toc
const processTocMapLinks = function (maps: MapInfo[]) {
    // reversed because links are added with before, so if there is more than one link they still will be in order
    maps.reverse().forEach(map => {
        if (map.tocHeaderSelector) {
            const jqTargetAnchor = $(map.tocHeaderSelector);
            addMenuMapLink(map, jqTargetAnchor, true,
                `TOC header with selector "${map.tocHeaderSelector}" not found ${fromMapMsg(map)}.`,
                `Unable to add TOC map link with selector "${map.tocHeaderSelector}" ${fromMapMsg(map)}.`
            );
            return;
        }

        const headerId = map.tocHeaderId || map.menuHeaderId;
        const selector = `.article-main a[href$='${map.isChapterMap ? map.page : "#" + headerId}']`;
        const msg = map.isChapterMap ? `for page "${map.page}"` : `with id "${headerId}"`;
        const jqTargetAnchor = $(selector);
        addMenuMapLink(map, jqTargetAnchor, true,
            `TOC header ${msg} not found ${fromMapMsg(map)}.`,
            `Unable to add TOC map link ${msg} ${fromMapMsg(map)}.`
        );

        if (!map.extraMenuHeaderIds || !Array.isArray(map.extraMenuHeaderIds)) return;
        map.extraMenuHeaderIds.forEach(headerId => {
            const jqTargetAnchor = $(selector);
            addMenuMapLink(map, jqTargetAnchor, true,
                `TOC header with id "${headerId}" not found ${fromMapMsg(map)}.`,
                `Unable to add TOC map link with id "${headerId}" ${fromMapMsg(map)}.`
            );
        });
    });
};

// adds links to maps on page menu
const innerProcessMenuMapLink = function (map: MapInfo, headerId: string, jqMenu: JQuery<HTMLElement>) {
    const jqTargetAnchor = jqMenu.find(`a[href='#${headerId}']`);
    addMenuMapLink(map, jqTargetAnchor, false,
        `Menu header with id "${headerId}" not found ${fromMapMsg(map)}.`,
        `Unable to add menu map link with header id "${headerId}" ${fromMapMsg(map)}.`
    );
};

// adds links to maps on page menu
const processMenuMapLink = function (map: MapInfo) {
    const jqMenu = $(".quick-menu.quick-menu-tier-1, .quick-menu.quick-menu-tier-2");
    if (jqMenu.length === 0) return;

    innerProcessMenuMapLink(map, map.menuHeaderId, jqMenu);

    if (!map.extraMenuHeaderIds || !Array.isArray(map.extraMenuHeaderIds)) return;
    map.extraMenuHeaderIds.forEach(menuHeaderId => innerProcessMenuMapLink(map, menuHeaderId, jqMenu));
};

// add a hoverable tooltip link to a map for every target with the corresponding selector
const processMapLinks = function (map: MapInfo) {
    const mapLinks = map.mapLinks;
    if (!mapLinks || !mapLinks.targetSelectors) return;

    mapLinks.targetSelectors.forEach(selector => {
        const jqTarget = $(selector);
        if (jqTarget.length === 0) {
            E.log(`Header with selector "${selector}" not found ${fromMapMsg(map)}.`);
            return;
        }
        const jqLinkContainer = $("<span class='BH-map-link-container'></span>");
        jqTarget.append(jqLinkContainer);

        E.tryCatch(() => {
            ReactDOM.render(<MapLink info={mapLinks} />, jqLinkContainer[0]);
        }, `Failed to render map link to header with selector "${selector}" ${fromMapMsg(map)}.`);
    });
};

// creates the map areas for a map, that shows a tooltip
const processMap = function (map: MapInfo, config: Configuration) {
    // checks if map found
    const jqMapImg = $(`img[src$='/${map.mapImageName}']`);
    if (jqMapImg.length === 0) {
        E.log(`Map with file name "${map.mapImageName}" not found.`);
        return;
    }

    // renders map areas
    jqMapImg.attr("usemap", `#${map.mapImageName}`);
    const jqMapContainer = jqMapImg.parent();
    const jqAreasContainer = $("<div></div>");
    jqMapContainer.append(jqAreasContainer);

    E.tryCatch(() => {
        ReactDOM.render(<MapAreas map={map} config={config} />, jqAreasContainer[0], () => {
            // handle map ref highlights
            jqMapImg.maphilight();

            // unfortunatelly the maphilight may use timeouts if the img is not loaded
            // so as a workaround we have to do the same until the highlight is processed
            const setupMouseOver = () => {
                if (jqMapImg.hasClass("maphilighted")) {
                    const jqAreas = jqMapContainer.find("area");
                    jqMapImg.mouseover(() => jqAreas.mouseover()).mouseout(() => jqAreas.mouseout());
                } else {
                    window.setTimeout(setupMouseOver, 200);
                }
            };
            setupMouseOver();
        });
    }, `Failed to render areas from map "${map.mapImageName}" from compendium "${map.basePath}".`);

    // renders a link to the map on menu
    if (config[Opt.MapMenuLinks]) processMenuMapLink(map);

    // renders links to map on headers both from defined areas and extra links
    if (config[Opt.MapLinks]) processMapLinks(map);
};

const scrollToContentIdReference = function () {
    const data = FragmentService.parse(window.location.hash);
    if (!data) return;
    const jqTarget = data.contentId ? $(`[data-content-chunk-id='${data.contentId}']`) : $(`#${data.id}`);
    if (jqTarget.length === 0) return;
    jqTarget[0].scrollIntoView();
};

class MapsService {
    static init(config: Configuration) {
        if (!LocationService.isOnCompendium("")) return;

        ConfigStorageService.getFormMapRefs().then(formMapRefsData => {
            // register all maps to pre process
            [
                MapsLMoP,
                MapsHotDQ,
                MapsRoT,
                MapsPotA,
                MapsOotA,
                MapsCoS,
                MapsTftYP,
                MapsToA
            ].forEach(MapsPreProcessService.register);

            // create map refs from form data added on options page
            FormMapsService.buildMapRefs(formMapRefsData).forEach(mapRefs => {
                MapsPreProcessService.register(mapRefs);
            });

            processMapRefs(MapsPreProcessService.preProcess(), config);

            // listen hash changes to scroll to refs with contentId
            window.addEventListener("hashchange", scrollToContentIdReference, false);
            // scroll to ref with contentId
            scrollToContentIdReference();
        });
    }
}

export default MapsService;