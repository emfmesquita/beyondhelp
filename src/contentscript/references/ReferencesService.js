import $ from "jquery";
import React from 'react';
import ReactDOM from 'react-dom';
import ReferenceApp from "./ReferenceApp";

const headersSelector = ".primary-content h1[id], .primary-content h2[id], .primary-content h3[id], .primary-content h4[id], .primary-content h5[id]";

// listens a copy event from a copy ref element and change the content
// to be copied to the reference anchor
const handleRefCopy = function (e: ClipboardEvent) {
    if (!e.target || !e.target.classList || !e.target.classList.contains("BH-copy-reference")) return;

    const refButton: HTMLElement = e.target;
    const data: DataTransfer = e.clipboardData;
    data.setData("text/html", refButton.dataset.refContent);
    e.preventDefault();
};

// renders in queue the copy ref buttons
const setupHeaders = function (headers: HTMLElement[], index: Number) {
    const header = headers[index];
    const jqContainer = $("<span/>");
    $(header).append(jqContainer);
    ReactDOM.render(<ReferenceApp label={header.textContent} refId={header.id} />, jqContainer[0]);
    if (index >= headers.length - 1) return;
    setTimeout(() => setupHeaders(headers, index + 1), 0);
};

class ReferencesService {
    static init() {
        const path = window.location.pathname;
        if (!path.startsWith("/compendium/") || path.split("/").length < 5) return;

        document.addEventListener("copy", handleRefCopy);
        const headers = $(headersSelector);

        const headersArray = [];
        headers.each((idx, header) => headersArray.push(header));
        setupHeaders(headersArray, 0);
    }
}

export default ReferencesService;