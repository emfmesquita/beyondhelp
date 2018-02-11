import { FragmentData, FragmentService } from "../../services/FragmentService";
import React, { Component } from 'react';

import C from "../../Constants";
import MapLinksInfo from "./MapLinksInfo";

class MapLink extends Component {
    click = (e: MouseEvent, href: string) => {
        if (e.button !== 0) return;
        e.preventDefault();
        e.stopPropagation();
        if (window.location.href === href) {
            window.dispatchEvent(new Event("hashchange"));
        } else {
            window.location = href;
        }
    }

    render() {
        const info: MapLinksInfo = this.props.info;
        const href = `${C.AdventuresPage}${info.toPage}${FragmentService.format(info.toPage, info.mapContentId, true)}`;
        return <a className="BH-map-link tooltip-hover" href={href} onClick={(e) => this.click(e, href)}>🌎︎</a>;
    }
}

export default MapLink;