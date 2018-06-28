import "./ExtraMapRefsInfo.scss";

import React, { Component } from "react";

import $ from "jquery";
import BeyondHelpIcon from "./BeyondHelpIcon";
import ClipboardEntry from "../../../data/ClipboardEntry";
import ClipboardService from "../../../services/ClipboardService";
import HTMLUtils from "../../../services/HTMLUtils";
import QTipService from "../../QTipService";

const qTipTarget = (el: HTMLElement) => $(el).closest(".BH-extra-map-refs-page-info-row");
const qTipOptions = {
    hide: { event: "mouseleave" },
    position: {
        my: "right center",
        at: "left center"
    }
};

class ExtraMapRefsInfo extends Component {
    constructor(props) {
        super(props);
    }

    renderRow = (row, idx) => {
        if (!row || !row.label) return null;

        // copies text on click and shows copied tooltip
        const handleClick = (e: MouseEvent) => ClipboardService.copy(
            [new ClipboardEntry("text/plain", row.text)],
            () => QTipService.showQTip(qTipTarget(e.target), HTMLUtils.toBold("Copied!"), qTipOptions)
        );

        return (
            <div title="Click to Copy" className="BH-extra-map-refs-page-info-row" key={idx} onClick={handleClick}>
                <span>{row.label}: </span><span>{row.text || ""}</span>
            </div>
        );
    }

    render() {
        const info = this.props.info;
        if (!info || !Array.isArray(info) || info.length === 0) return null;

        return (
            <blockquote className="adventure-read-aloud-text BH-extra-map-refs-page-info">
                <BeyondHelpIcon /><h4>Beyond Help - Extra Map References Info</h4>
                {info.map(this.renderRow)}
            </blockquote>
        );
    }
}

export default ExtraMapRefsInfo;