import React, { Component } from "react";

import $ from "jquery";
import ClipboardEntry from "../../data/ClipboardEntry";
import ClipboardService from "../../services/ClipboardService";
import HTMLUtils from "../../services/HTMLUtils";
import QTipService from "../QTipService";

class ReferenceApp extends Component {
    constructor(props) {
        super(props);
        this.jqRefButton = null;
        this.refPath = `https://www.dndbeyond.com${window.location.pathname}#${props.refId}`;
    }

    copyReference = () => {
        const copyEntries = [
            new ClipboardEntry("text/html", `<a class="tooltip-hover" href="${this.refPath}">${this.props.label}</a>`),
            new ClipboardEntry("text/plain", this.refPath)
        ];

        ClipboardService.copy(copyEntries, () => {
            // shows the tooltip indicating a successful ref copy
            QTipService.animateIntoQTip(this.jqRefButton, HTMLUtils.toBold("Reference Copied!"), 500);
        });
    }

    render() {
        return (
            <span title="Click to copy a reference.">
                <a className="BH-copy-reference" href="javascript:void(0)" onClick={this.copyReference} ref={(el) => this.jqRefButton = $(el)} />
            </span>
        );
    }
}

export default ReferenceApp; 