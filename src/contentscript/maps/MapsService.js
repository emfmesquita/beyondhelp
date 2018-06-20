import "maphilight";

import { FragmentData, FragmentService } from "../../services/FragmentService";
import React, { Component } from 'react';

import $ from "jquery";
import ConfigStorageService from "../../services/storage/ConfigStorageService";
import Configuration from "../../data/Configuration";
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
import MapsCoS from "./compendiums/MapsCoS";
import MapsHotDQ from "./compendiums/MapsHotDQ";
import MapsLMoP from "./compendiums/MapsLMoP";
import MapsOotA from "./compendiums/MapsOotA";
import MapsPotA from "./compendiums/MapsPotA";
import MapsRoT from "./compendiums/MapsRoT";
import MapsTftYP from "./compendiums/MapsTftYP";
import MapsToA from "./compendiums/MapsToA";
import Opt from "../../Options";
import PageScriptService from "../../services/PageScriptService";
import ReactDOM from 'react-dom';
import ReferencesUtils from "../../services/ReferencesUtils";

// creates both map refs and map links
const processMapRefs = function (refsClass: typeof MapRefs, config: Configuration) {
    // is on toc
    if (LocationService.isOnToc(refsClass.path) && config[Opt.MapTocLinks]) {
        processTocMapLinks(refsClass);
        return;
    }

    // if not on compendium page just returns
    if (!LocationService.isOnCompendium(refsClass.path)) return;

    // map refs + map links already defined on maps + map menu links
    refsClass.maps.forEach(map => processMap(map, config));

    // extra map links 
    if (!refsClass.extraMapLinks || !config[Opt.MapLinks]) return;
    refsClass.extraMapLinks.forEach(extraMapLinks => {
        // check if it is on the from page of the map links
        if (LocationService.isOnCompendium(extraMapLinks.fromPage)) processMapLinks(extraMapLinks);
    });
};

// adds a menu map link before a target anchor
const addMenuMapLink = function (map: MapInfo, jqTargetAnchor: JQuery<HTMLElement>, tocLink: boolean) {
    if (jqTargetAnchor.length === 0) return;
    const jqLinkContainer = $("<span class='BH-map-link-container'></span>");
    tocLink ? jqTargetAnchor.after(jqLinkContainer) : jqTargetAnchor.before(jqLinkContainer);
    ReactDOM.render(<MapMenuLink map={map} tocLink={tocLink} />, jqLinkContainer[0]);
};

// add links to maps on toc
const processTocMapLinks = function (refsClass: typeof MapRefs) {
    // reversed because links are added with before, so if there is more than one link they still will be in order
    refsClass.maps.reverse().forEach(map => {
        if (map.tocHeaderSelector) {
            addMenuMapLink(map, $(map.tocHeaderSelector), true);
            return;
        }

        const headerId = map.tocHeaderId || map.menuHeaderId;
        const selector = `.article-main a[href$='${map.isChapterMap ? map.page : "#" + headerId}']`;
        addMenuMapLink(map, $(selector), true);
    });
};

// add links to maps on page menu
const processMenuMapLink = function (map: MapInfo) {
    const jqMenu = $(".quick-menu.quick-menu-tier-1, .quick-menu.quick-menu-tier-2");
    if (jqMenu.length === 0) return;
    addMenuMapLink(map, jqMenu.find(`a[href='#${map.menuHeaderId}']`));
    if (map.extraMenuHeaderIds) {
        map.extraMenuHeaderIds.forEach(menuHeaderId => addMenuMapLink(map, jqMenu.find(`a[href='#${menuHeaderId}']`)));
    }
};

// add a hoverable tooltip link to a map for every target with the corresponding selector
const processMapLinks = function (mapLinks: MapLinksInfo) {
    if (!mapLinks || !mapLinks.targetSelectors) return;

    mapLinks.targetSelectors.forEach(selector => {
        const jqTarget = $(selector);
        if (jqTarget.length === 0) return;
        const jqLinkContainer = $("<span class='BH-map-link-container'></span>");
        jqTarget.append(jqLinkContainer);
        ReactDOM.render(<MapLink info={mapLinks} />, jqLinkContainer[0]);
    });
};

// creates the map areas for a map, that shows a tooltip
const processMap = function (map: MapInfo, config: Configuration) {
    // chek if it is on the map page
    if (!LocationService.isOnCompendium(map.page)) return;

    // checks if map found
    const jqMapImg = $(`img[src$='/${map.mapImageName}']`);
    if (jqMapImg.length === 0) return;

    // renders map areas
    jqMapImg.attr("usemap", `#${map.mapImageName}`);
    const jqMapContainer = jqMapImg.parent();
    const jqAreasContainer = $("<div></div>");
    jqMapContainer.append(jqAreasContainer);
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

    // renders a link to the map on menu
    if (config[Opt.MapMenuLinks]) processMenuMapLink(map);

    // renders links to map on headers both from defined areas and extra links
    if (config[Opt.MapLinks]) processMapLinks(map.mapLinks);
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
        const path = window.location.pathname;
        if (!LocationService.isOnCompendium("")) return;

        ConfigStorageService.getFormMapRefs().then(formMapRefsData => {
            // inits all maps of the current page
            processMapRefs(MapsLMoP, config);
            processMapRefs(MapsHotDQ, config);
            processMapRefs(MapsRoT, config);
            processMapRefs(MapsPotA, config);
            processMapRefs(MapsOotA, config);
            processMapRefs(MapsCoS, config);
            processMapRefs(MapsTftYP, config);
            processMapRefs(MapsToA, config);

            // create map refs from form data added on options page
            FormMapsService.buildMapRefs(formMapRefsData).forEach(mapRefs => {
                try {
                    processMapRefs(mapRefs, config);
                } catch (e) {
                    console.error(`Beyond Help: Failed to load map references from ${mapRefs.path}.`);
                    console.error(e);
                }
            });

            // listen hash changes to scroll to refs with contentId
            window.addEventListener("hashchange", scrollToContentIdReference, false);
            // scroll to ref with contentId
            scrollToContentIdReference();
        });
    }
}

export default MapsService;