import { FragmentData, FragmentService } from "../../services/FragmentService";
import React, { Component } from 'react';

import C from "../../Constants";
import Configuration from "../../data/Configuration";
import MapAreaInfo from "./MapAreaInfo";
import Opt from "../../Options";

class MapAreas extends Component {
    postProcessArea = (el: HTMLElement, href: string, hash: string) => {
        // to force onclick attribute that stops click propagation that opens the light box
        if (el) el.setAttribute("onclick", "event.preventDefault(); event.stopPropagation();");
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
        const areas: MapAreaInfo[] = this.props.areas;
        const config: Configuration = this.props.config;
        if (!areas) return null;
        return areas.map(area => {
            if (area.shape === C.MapAreaRect && !config[Opt.MapRefsRect]) return;
            if (area.shape === C.MapAreaCircle && !config[Opt.MapRefsCirc]) return;
            if (area.shape === C.MapAreaRhombus && !config[Opt.MapRefsRho]) return;
            const shape = area.shape === C.MapAreaRhombus ? "poly" : area.shape;


            // if area is missing info the tooltip class is not added
            // and a tooltip is nod added and href is set to void
            const tooltipable = area.isTooltiplable();
            const tooltipClass = tooltipable ? `BH-map-ref-${area.shape}` : "";
            const className = `tooltip-hover BH-map-ref ${tooltipClass}`;
            const href = tooltipable ? `${C.CompendiumPage}${area.page}${FragmentService.format(area.headerId, area.contentId, area.untilContentId, area.contentOnly)}` : "javascript:void(0)";

            const maphilightData = {};
            const color = area.color;
            if (color) maphilightData.strokeColor = color.startsWith("#") ? color.substr(1) : color;

            return (
                <area
                    key={area.id || area.coords}
                    bh-id={area.id}
                    className={className}
                    href={href}
                    shape={shape}
                    drawable={area.isDrawable.toString()}
                    coords={area.coords}
                    data-maphilight={JSON.stringify(maphilightData)}
                    ref={(el) => this.postProcessArea(el, href)}
                    onMouseDown={(e) => this.toMapRef(e, href)}
                />
            );
        });
    }

    render() {
        return (
            <map name={this.props.mapImageName}>
                {this.renderAreas()}
            </map>
        );
    }
}

export default MapAreas;