import "./ExtraMapRefsMode.scss";

import $ from "jquery";
import DrawingService from "./drawing/DrawingService";
import DrawingToolbar from "./drawing/DrawingToolbar";
import ExtraMapRefsInfo from "./ExtraMapRefsInfo";
import ExtraMapRefsModeTooltipHelper from "./ExtraMapRefsModeTooltipHelper";
import ExtraMapRefsModeTooltipInfo from "./ExtraMapRefsModeTooltipInfo";
import LocationService from "../../../services/LocationService";
import MapsService from "../MapsService";
import React from "react";
import ReactDOM from "react-dom";

let copyTarget = null;

const ignoreClass = "BH-ignore-tooltip";

// gets the nth position of a character on a string
const getPosition = (string: string, subString: string, index: number) => {
    return string.split(subString, index).join(subString).length;
};

const getPageInfo = (pathname: string) => {
    const fullPath = pathname.substr(12);
    const pathEnd = getPosition(fullPath, "/", 2);
    const builtInfo = {
        path: fullPath.substr(0, pathEnd + 1),
        page: fullPath.substr(pathEnd + 1)
    };
    builtInfo.isOnToc = builtInfo.page === "";
    return builtInfo;
};

const info = getPageInfo(window.location.pathname);

const pageInfoCache = {};
const getPageInfoCached = (url: string) => {
    const cached = pageInfoCache[url];
    if (cached) return cached;

    const builtInfo = getPageInfo(new URL(url).pathname);
    pageInfoCache[url] = builtInfo;
    return builtInfo;
};

const renderPageInfo = () => {
    const pageInfoDiv = document.createElement("div");
    $(".primary-content article.p-article").prepend(pageInfoDiv);

    const pageInfo = [
        { label: "Path", text: info.path },
        { label: "Page", text: info.page }
    ];

    ReactDOM.render(<ExtraMapRefsInfo info={pageInfo} />, pageInfoDiv);
};

const renderMapsInfo = () => {
    $(".primary-content .ddb-lightbox-outer img").each((idx, img) => {
        const jqImg = $(img);

        jqImg.addClass("BH-extra-map-refs-mode").closest("a").addClass("BH-extra-map-refs-mode");
        DrawingService.initMap(jqImg);

        const mapInfoDiv = document.createElement("div");
        const jqImgContainer = jqImg.parent();
        jqImgContainer.before(mapInfoDiv);

        const jqContainer = jqImg.closest("p[data-content-chunk-id]");
        jqContainer.addClass(ignoreClass);
        const contentId = jqContainer.attr("data-content-chunk-id");
        const imageName = MapsService.getMapImageName(jqImg);

        const mapInfo = [
            { label: "Page", text: info.page },
            { label: "Image Name", text: imageName },
            { label: "Content Id", text: contentId }
        ];

        ReactDOM.render(<ExtraMapRefsInfo info={mapInfo} />, mapInfoDiv);
    });
};

const renderDrawingToolbar = () => {
    const toolbarDiv = document.createElement("div");
    $("#site-main").append(toolbarDiv);
    ReactDOM.render(<DrawingToolbar />, toolbarDiv);
};

const addTooltipsOnMenuHeaders = () => {
    $(".secondary-content .quick-menu-item-link").each((idx, menuLink) => {
        const jqMenuLink = $(menuLink);

        const href = jqMenuLink.attr("href");
        const hashIndex = href.indexOf("#");

        const headerId = href.substr(hashIndex + 1);
        const tooltipInfo = new ExtraMapRefsModeTooltipInfo(jqMenuLink).rightInfo("Menu Element Id", headerId);

        const page = hashIndex === 0 ? info.page : getPageInfoCached(href.substr(0, hashIndex)).page;
        tooltipInfo.middleInfo("Page", page);

        ExtraMapRefsModeTooltipHelper.addCopyTooltip(tooltipInfo);
    });
};

const addTooltipsOnHeaders = () => {
    const sel = (number) => `.primary-content h${number}[id]`;
    const headersSelector = `${sel(1)}, ${sel(2)}, ${sel(3)}, ${sel(4)}, ${sel(5)}`;
    $(headersSelector).each((idx, header) => {
        const jqHeader = $(header);
        const headerId = jqHeader.attr("id");
        const contentId = jqHeader.attr("data-content-chunk-id");

        const tooltipInfo = new ExtraMapRefsModeTooltipInfo(jqHeader).rightInfo("Header Id", headerId);
        if (contentId) tooltipInfo.middleInfo("Content Id", contentId);
        ExtraMapRefsModeTooltipHelper.addCopyTooltip(tooltipInfo);
    });
};

const addTooltipsOnOthers = () => {
    const sel = (el) => `${el}[data-content-chunk-id]:not(.${ignoreClass})`;
    $(`${sel("p")}, ${sel("ul")}, ${sel("li")}, ${sel("table")}, ${sel("blockquote")}`).each((idx, el) => {
        const jqEl = $(el);
        const contentId = jqEl.attr("data-content-chunk-id");
        const tooltipInfo = new ExtraMapRefsModeTooltipInfo(jqEl).middleInfo("Content Id", contentId);
        ExtraMapRefsModeTooltipHelper.addCopyTooltip(tooltipInfo);
    });
};

const addTooltipsOnToc = () => {
    $(".compendium-toc-block-text a, .compendium-toc-full-text a").each((idx, el) => {
        const jqEl = $(el);
        const href = jqEl.attr("href");
        if (!href || href.indexOf("#") < 0) return;

        const tocId = href.substring(href.indexOf("#") + 1, href.length);
        const tooltipInfo = new ExtraMapRefsModeTooltipInfo(jqEl).rightInfo("Toc Link Id", tocId);
        ExtraMapRefsModeTooltipHelper.addCopyTooltip(tooltipInfo);
    });
};

class ExtraMapRefsMode {
    static init() {
        if (!LocationService.isOnCompendium("")) return;

        // page info
        if (!info.isOnToc) {
            renderPageInfo();
            renderMapsInfo();
            renderDrawingToolbar();
            addTooltipsOnMenuHeaders();
            addTooltipsOnHeaders();
            addTooltipsOnOthers();
        } else {
            addTooltipsOnToc();
        }
    }

    static getPath(): string {
        return info.path;
    }

    static getPage(): string {
        return info.page;
    }
}

export default ExtraMapRefsMode;