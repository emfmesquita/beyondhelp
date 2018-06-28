import $ from "jquery";
import React from 'react';
import ReactDOM from 'react-dom';
import ReferenceApp from "./ReferenceApp";
import ReferencesUtils from "../../services/ReferencesUtils";

const headersSelector = ".primary-content h1[id], .primary-content h2[id], .primary-content h3[id], .primary-content h4[id], .primary-content h5[id]";

// renders in queue the copy ref buttons
const setupHeaders = function (headers: HTMLElement[], index: Number) {
    const header = headers[index];

    const jqHeader = $(header);
    const jqContainer = $("<span id='BH-ref-button-container'/>");
    jqHeader.append(jqContainer);

    const label = ReferencesUtils.headerLabel(jqHeader);

    ReactDOM.render(<ReferenceApp label={label} refId={header.id} />, jqContainer[0]);
    if (index >= headers.length - 1) return;
    setTimeout(() => setupHeaders(headers, index + 1), 0);
};

class ReferencesService {
    static init() {
        const path = window.location.pathname;
        if (!path.startsWith("/compendium/") || path.split("/").length < 5) return;

        const headers = $(headersSelector);

        const headersArray = [];
        headers.each((idx, header) => headersArray.push(header));
        setupHeaders(headersArray, 0);
    }
}

export default ReferencesService;