import React, { Component } from 'react';

import $ from "jquery";
import MapAreas from "./MapAreas";
import MapInfo from "./MapInfo";
import MapInfoEntry from "./MapInfoEntry";
import Maps from "./Maps";
import ReactDOM from 'react-dom';

const processMapEntry = function (map: MapInfo) {
    if (!window.location.pathname.endsWith(map.page)) return;
    const jqMapImg = $(`img[src$='${map.name}']`);
    if (jqMapImg.length === 0) return;
    jqMapImg.attr("usemap", `#${map.id}`);
    const jqMapContainer = jqMapImg.parent();
    const jqAreasContainer = $("<div></div>");
    jqMapContainer.append(jqAreasContainer);
    ReactDOM.render(<MapAreas map={map} />, jqAreasContainer[0]);
}

class MapsService {
    static init() {
        Maps.maps.forEach(processMapEntry);
    }
}

export default MapsService;