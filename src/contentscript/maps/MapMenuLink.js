import React, { Component } from 'react';

import MapInfo from "./MapInfo";
import MapLinksUtils from "./MapLinksUtils";

class MapMenuLink extends Component {
    render() {
        const map: MapInfo = this.props.map;
        const href = MapLinksUtils.href(map.page, map.contentId);
        const className = `${this.props.tocLink ? "BH-map-toc-link" : "BH-map-menu-link quick-menu-item-link"} tooltip-hover`;
        return <a className={className} href={href} onClick={(e) => MapLinksUtils.click(e, href)}><i className="fa fa-map" /></a>;
    }
}

export default MapMenuLink;