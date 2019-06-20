import $ from "jquery";
import React from 'react';
import ReactDOM from 'react-dom';
import ReferenceApp from "./ReferenceApp";
import HeaderToolbarService from "../../services/HeaderToolbarService";

const headersSelector = ".primary-content h1[id], .primary-content h2[id], .primary-content h3[id], .primary-content h4[id], .primary-content h5[id]";

// renders in queue the copy ref buttons
const setupHeaders = function (headers: HTMLElement[], index: Number) {
    const header = headers[index];

    const jqHeader = $(header);
    const label = HeaderToolbarService.headerLabel(jqHeader);
    const container = HeaderToolbarService.referenceButtonContainer(jqHeader);

    ReactDOM.render(<ReferenceApp label={label} refId={header.id} />, container);
    if (index >= headers.length - 1) return;
    setTimeout(() => setupHeaders(headers, index + 1), 0);
};

class ReferencesService {
    static init() {
        const path = window.location.pathname;
        if (!path.startsWith("/sources/") || path.split("/").length < 4) return;

        const headers = $(headersSelector);

        const headersArray = [];
        headers.each((idx, header) => headersArray.push(header));
        setupHeaders(headersArray, 0);
    }
}

export default ReferencesService;