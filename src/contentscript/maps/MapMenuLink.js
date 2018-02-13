import React, { Component } from 'react';

import MapInfo from "./MapInfo";
import MapLinksUtils from "./MapLinksUtils";

class MapMenuLink extends Component {
    render() {
        const map: MapInfo = this.props.map;
        const href = MapLinksUtils.href(map.page, map.contentId);
        return <a className="BH-map-menu-link quick-menu-item-link tooltip-hover" href={href} onClick={(e) => MapLinksUtils.click(e, href)}>🌎︎</a>;
    }
}

export default MapMenuLink;