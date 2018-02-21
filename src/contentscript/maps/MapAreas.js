import { FragmentData, FragmentService } from "../../services/FragmentService";
import React, { Component } from 'react';

import C from "../../Constants";
import Configuration from "../../data/Configuration";
import MapAreaInfo from "./MapAreaInfo";
import MapInfo from "./MapInfo";
import Opt from "../../Options";

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
        const mapInfo: MapInfo = this.props.map;
        const config: Configuration = this.props.config;
        return mapInfo.areas.map(area => {
            if (area.shape === C.MapAreaRect && !config[Opt.MapRefsRect]) return;
            if (area.shape === C.MapAreaCircle && !config[Opt.MapRefsCirc]) return;
            if (area.shape === C.MapAreaRhombus && !config[Opt.MapRefsRho]) return;
            const shape = area.shape === C.MapAreaRhombus ? "poly" : area.shape;
            const href = `${C.AdventuresPage}${area.page || mapInfo.page}${FragmentService.format(area.id, area.contentId, area.untilContentId, area.contentOnly)}`;
            const className = `tooltip-hover BH-map-ref BH-map-ref-${area.shape} ${area.highlight ? " BH-area-highlight" : ""}`;
            return <area key={area.coords} className={className} shape={shape} coords={area.coords} href={href} ref={(el) => this.postProcessArea(el, href)} onMouseDown={(e) => this.toMapRef(e, href)} />;
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