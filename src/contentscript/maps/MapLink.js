import React, { Component } from 'react';

import MapLinksInfo from "./MapLinksInfo";
import MapLinksUtils from "./MapLinksUtils";

class MapLink extends Component {
    render() {
        const info: MapLinksInfo = this.props.info;
        const href = MapLinksUtils.href(info.toPage, info.mapContentId);
        return <a className="BH-map-link tooltip-hover" href={href} onClick={(e) => MapLinksUtils.click(e, href)}><i className="fa fa-map" /></a>;
    }
}

export default MapLink;