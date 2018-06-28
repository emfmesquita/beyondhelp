import $ from "jquery";
import ExtraMapRefsInfo from "./ExtraMapRefsInfo";
import ExtraMapRefsModeHelper from "./ExtraMapRefsModeHelper";
import ExtraMapRefsModeTooltipInfo from "./ExtraMapRefsModeTooltipInfo";
import LocationService from "../../../services/LocationService";
import React from "react";
import ReactDOM from "react-dom";

let copyTarget = null;

const ignoreClass = "BH-ignore-tooltip";

// gets the nth position of a character on a string
const getPosition = (string: string, subString: string, index: number) => {
    return string.split(subString, index).join(subString).length;
};

const renderPageInfo = (path: string, page: string) => {
    const pageInfoDiv = document.createElement("div");
    $(".primary-content article.p-article").prepend(pageInfoDiv);

    const pageInfo = [
        { label: "Path", text: path },
        { label: "Page", text: page }
    ];

    ReactDOM.render(<ExtraMapRefsInfo info={pageInfo} />, pageInfoDiv);
};

const renderMapsInfo = (path: string, page: string) => {
    $(".primary-content .ddb-lightbox-outer img").each((idx, img) => {
        const jqImg = $(img);
        const jsImgContainer = jqImg.parent();

        const mapInfoDiv = document.createElement("div");
        jsImgContainer.before(mapInfoDiv);

        const imgSrc = jqImg.attr("src");
        const imageName = imgSrc.substr(imgSrc.lastIndexOf("/") + 1);

        const jqContainer = jqImg.closest("p[data-content-chunk-id]");
        jqContainer.addClass(ignoreClass);
        const contentId = jqContainer.attr("data-content-chunk-id");

        const mapInfo = [
            { label: "Page", text: page },
            { label: "Image Name", text: imageName },
            { label: "Content Id", text: contentId }
        ];

        ReactDOM.render(<ExtraMapRefsInfo info={mapInfo} />, mapInfoDiv);
    });
};

const addTooltipsOnMenuHeaders = () => {
    $(".secondary-content .quick-menu-item-link").each((idx, menuLink) => {
        const jqMenuLink = $(menuLink);
        const headerId = jqMenuLink.attr("href").substr(1);

        const info = new ExtraMapRefsModeTooltipInfo(jqMenuLink).rightInfo("Menu Element Id", headerId);
        ExtraMapRefsModeHelper.addCopyTooltip(info);
    });
};

const addTooltipsOnHeaders = () => {
    const sel = (number) => `.primary-content h${number}[id]`;
    const headersSelector = `${sel(1)}, ${sel(2)}, ${sel(3)}, ${sel(4)}, ${sel(5)}`;
    $(headersSelector).each((idx, header) => {
        const jqHeader = $(header);
        const headerId = jqHeader.attr("id");
        const contentId = jqHeader.attr("data-content-chunk-id");

        const info = new ExtraMapRefsModeTooltipInfo(jqHeader).rightInfo("Header Id", headerId);
        if (contentId) info.middleInfo("Content Id", contentId);
        ExtraMapRefsModeHelper.addCopyTooltip(info);
    });
};

const addTooltipsOnOthers = () => {
    const sel = (el) => `${el}[data-content-chunk-id]:not(.${ignoreClass})`;
    $(`${sel("p")}, ${sel("ul")}, ${sel("li")}, ${sel("table")}, ${sel("blockquote")}`).each((idx, el) => {
        const jqEl = $(el);
        const contentId = jqEl.attr("data-content-chunk-id");
        const info = new ExtraMapRefsModeTooltipInfo(jqEl).rightInfo("Content Id", contentId);
        ExtraMapRefsModeHelper.addCopyTooltip(info);
    });
};

class ExtraMapRefsMode {
    static init() {
        if (!LocationService.isOnCompendium("")) return;

        const fullPath = window.location.pathname.substr(12);
        const pathEnd = getPosition(fullPath, "/", 2);
        const path = fullPath.substr(0, pathEnd + 1);
        const page = fullPath.substr(pathEnd + 1);
        const isOnToc = page === "";

        // page info
        if (!isOnToc) {
            renderPageInfo(path, page);
            renderMapsInfo(path, page);
            addTooltipsOnMenuHeaders();
            addTooltipsOnHeaders();
            addTooltipsOnOthers();
        }
    }
}

export default ExtraMapRefsMode;