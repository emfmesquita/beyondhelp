import "maphilight";

import { FragmentData, FragmentService } from "../../services/FragmentService";
import React, { Component } from 'react';

import $ from "jquery";
import MapAreaInfo from "./MapAreaInfo";
import MapAreas from "./MapAreas";
import MapInfo from "./MapInfo";
import MapLink from "./MapLink";
import MapLinksInfo from "./MapLinksInfo";
import MapMenuLink from "./MapMenuLink";
import MapRefs from "./MapRefs";
import MapsHotDQ from "./adventures/MapsHotDQ";
import MapsLMoP from "./adventures/MapsLMoP";
import MapsPotA from "./adventures/MapsPotA";
import MapsRoT from "./adventures/MapsRoT";
import PageScriptService from "../../services/PageScriptService";
import ReferencesUtils from "../../services/ReferencesUtils";
import ReactDOM from 'react-dom';

const check = (path: string) => window.location.pathname.startsWith("/compendium/adventures/" + path);

// creates both map refs and map links
const processMapRefs = function (refsClass: typeof MapRefs) {
    if (!check(refsClass.path)) return;

    // map refs + map links already defined on maps + map menu links
    refsClass.maps.forEach(processMap);

    // extra map links 
    if (!refsClass.extraMapLinks) return;
    refsClass.extraMapLinks.forEach(extraMapLinks => {
        // chek if it is on the from page of the map links
        if (check(extraMapLinks.fromPage)) processMapLinks(extraMapLinks);
    });
};

// add links to maps on page menu
const processMenuMapLink = function (map: MapInfo) {
    const jqMenu = $(".quick-menu.quick-menu-tier-1, .quick-menu.quick-menu-tier-2");
    if (jqMenu.length === 0) return;

    const jqMenuAnchor = jqMenu.find(`a[href='#${map.headerId}']`);
    if (jqMenuAnchor.length === 0) return;

    const jqLinkContainer = $("<span></span>");
    jqMenuAnchor.before(jqLinkContainer);
    ReactDOM.render(<MapMenuLink map={map} />, jqLinkContainer[0]);
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
const processMap = function (map: MapInfo) {
    // chek if it is on the map page
    if (!check(map.page)) return;

    // checks if map found
    const jqMapImg = $(`img[src$='${map.name}']`);
    if (jqMapImg.length === 0) return;

    // renders map areas
    jqMapImg.attr("usemap", `#${map.name}`);
    const jqMapContainer = jqMapImg.parent();
    const jqAreasContainer = $("<div></div>");
    jqMapContainer.append(jqAreasContainer);
    ReactDOM.render(<MapAreas map={map} />, jqAreasContainer[0], () => {
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
    processMenuMapLink(map);

    // renders links to map on headers both from defined areas and extra links
    processMapLinks(map.mapLinks);
};

const scrollToContentIdReference = function () {
    const data = FragmentService.parse(window.location.hash);
    if (!data) return;
    const jqTarget = data.contentId ? $(`[data-content-chunk-id='${data.contentId}']`) : $(`#${data.id}`);
    if (jqTarget.length === 0) return;
    jqTarget[0].scrollIntoView();
};

class MapsService {
    static init() {
        const path = window.location.pathname;
        if (!check("")) return;

        // inits all maps of the current page
        processMapRefs(MapsLMoP);
        processMapRefs(MapsHotDQ);
        processMapRefs(MapsRoT);
        processMapRefs(MapsPotA);

        // listen hash changes to scroll to refs with contentId
        window.addEventListener("hashchange", scrollToContentIdReference, false);
        // scroll to ref with contentId
        scrollToContentIdReference();
    }
}

export default MapsService;