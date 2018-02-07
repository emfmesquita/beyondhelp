import { FragmentData, FragmentService } from "../../services/FragmentService";
import React, { Component } from 'react';

import C from "../../Constants";

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
        const map = this.props.map;
        const href = `${C.AdventuresPage}${map.page}${FragmentService.formatContentOnly(map.contentId)}`;
        return <a className="BH-map-link tooltip-hover" href={href} onClick={(e) => this.click(e, href)}>🌎︎</a>;
    }
}

export default MapLink;