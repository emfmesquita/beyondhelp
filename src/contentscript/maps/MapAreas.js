import { FragmentData, FragmentService } from "../../services/FragmentService";
import React, { Component } from 'react';

import C from "../../Constants";
import MapAreaInfo from "./MapAreaInfo";
import MapInfo from "./MapInfo";

class MapAreas extends Component {
    postProcessArea = (el: HTMLElement, href: string, hash: string) => {
        // to force onclick attribute that stops click propagation that opens the light box
        el.setAttribute("onclick", "event.preventDefault(); event.stopPropagation();");
    }

    toMapRef = ({ button }: MouseEvent, href: string) => {
        if (button !== 0) return;
        if (window.location.href === href) {
            window.dispatchEvent(new Event("hashchange"));
        } else {
            window.location = href;
        }
    }

    renderAreas = () => {
        return this.props.map.areas.map(area => {
            const href = `${C.AdventuresPage}${area.page || this.props.map.page}${FragmentService.format(area.id, area.contentId)}`;
            return <area key={area.cords} className="tooltip-hover" shape="rect" coords={area.cords} href={href} ref={(el) => this.postProcessArea(el, href)} onMouseDown={(e) => this.toMapRef(e, href)} />;
        });
    }

    render() {
        return (
            <map name={this.props.map.name}>
                {this.renderAreas()}
            </map>
        );
    }
}

export default MapAreas;