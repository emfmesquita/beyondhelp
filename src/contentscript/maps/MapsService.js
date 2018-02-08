import { FragmentData, FragmentService } from "../../services/FragmentService";
import React, { Component } from 'react';

import $ from "jquery";
import MapAreaInfo from "./MapAreaInfo";
import MapAreas from "./MapAreas";
import MapInfo from "./MapInfo";
import MapLink from "./MapLink";
import MapsHotDQ from "./adventures/MapsHotDQ";
import MapsLMoP from "./adventures/MapsLMoP";
import MapsRoT from "./adventures/MapsRoT";
import PageScriptService from "../../services/PageScriptService";
import ReactDOM from 'react-dom';

const processMap = function (map: MapInfo) {
    // chek if it is on the map page
    if (!window.location.pathname.endsWith(map.page)) return;

    // checks if map found
    const jqMapImg = $(`img[src$='${map.name}']`);
    if (jqMapImg.length === 0) return;

    // renders map areas
    jqMapImg.attr("usemap", `#${map.name}`);
    const jqMapContainer = jqMapImg.parent();
    const jqAreasContainer = $("<div></div>");
    jqMapContainer.append(jqAreasContainer);
    ReactDOM.render(<MapAreas map={map} />, jqAreasContainer[0]);

    // renders links to map on headers both from defined areas and extra links
    const areasWithLinks: Set<string> = new Set();
    map.areas.forEach(area => area.addBackLink && areasWithLinks.add("#" + area.id));
    const areasWithLinksArray = Array.from(areasWithLinks);

    let linkSelectors = [];
    if (areasWithLinksArray) linkSelectors = linkSelectors.concat(areasWithLinksArray);
    if (map.extraMapLinkSelectors) linkSelectors = linkSelectors.concat(map.extraMapLinkSelectors);

    linkSelectors.forEach(selector => {
        const jqTarget = $(selector);
        if (jqTarget.length === 0) return;
        const jqLinkContainer = $("<span></span>");
        jqTarget.append(jqLinkContainer);
        ReactDOM.render(<MapLink map={map} />, jqLinkContainer[0]);
    });
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
        // inits all maps of the current page
        MapsLMoP.maps.forEach(processMap);
        MapsHotDQ.maps.forEach(processMap);
        MapsRoT.maps.forEach(processMap);

        // listen hash changes to scroll to refs with contentId
        window.addEventListener("hashchange", scrollToContentIdReference, false);
        // scroll to ref with contentId
        scrollToContentIdReference();
    }
}

export default MapsService;