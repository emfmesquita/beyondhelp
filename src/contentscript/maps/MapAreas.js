import React, { Component, MouseEvent } from 'react';

import MapInfo from "./MapInfo";
import MapInfoEntry from "./MapInfoEntry";

const advPage = "https://www.dndbeyond.com/compendium/adventures/";

class MapAreas extends Component {
    postProcessArea = (el: HTMLElement, href: string) => {
        // to force onclick attribute that stops click propagation
        el.setAttribute("onclick", `event.preventDefault(); event.stopPropagation(); window.location = "${href}";`);
    }

    renderAreas = () => {
        return this.props.map.entries.map(entry => {
            const href = `${advPage}${entry.page || this.props.map.page}#${entry.id}`;
            return <area key={entry.id} className="tooltip-hover" shape="rect" coords={entry.cords} href={href} ref={(el) => this.postProcessArea(el, href)} />;
        });
    }

    render() {
        return (
            <map name={this.props.map.id}>
                {this.renderAreas()}
            </map>
        );
    }
}

export default MapAreas;