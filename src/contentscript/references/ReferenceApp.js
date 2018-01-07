import React, { Component } from 'react';

import $ from "jquery";
import ContentScriptService from "../ContentScriptService";
import QTipService from "../QTipService";
import { throttle } from 'lodash';

class ReferenceApp extends Component {
    constructor(props) {
        super(props);
        this.refDummy = null;
        this.jqRefButton = null;
        this.refPath = `https://www.dndbeyond.com${window.location.pathname}#${props.refId}`;
    }

    copyReference = throttle(() => {
        // selects a dummy element and fires a copy
        // the handler is on ReferenceService
        var range = document.createRange();
        range.selectNodeContents(this.refDummy);
        var selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        document.execCommand("Copy");

        // shows the tooltip indicating a successful ref copy
        QTipService.AnimateIntoQTip(this.jqRefButton, "Reference Copied", 500);
    }, 500);

    buildReferenceContent = () => {
        return `<a class="tooltip-hover" href="${this.refPath}">${this.props.label}</a>`;
    }

    render() {
        return (
            <span title="Click to copy a reference.">
                <a className="BH-copy-reference" href="javascript:void(0)" data-ref-content={this.buildReferenceContent()} onClick={this.copyReference} ref={(el) => this.jqRefButton = $(el)} />
                <span style={{ display: "none" }} ref={(el) => this.refDummy = el} />
            </span>
        );
    }
}

export default ReferenceApp; 