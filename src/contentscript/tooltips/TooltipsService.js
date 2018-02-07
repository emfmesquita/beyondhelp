import $ from "jquery";
import C from "../../Constants";
import MessageService from "../../services/MessageService";
import PageScriptService from "../../services/PageScriptService";

//#region ref tooltips cache
class RefTooltipCacheEntry {
    constructor(jqHTML: JQuery<HTMLElement>, stylesArray: string[], title: string) {
        this.jqHTML = jqHTML;
        this.stylesArray = stylesArray;
        this.title = title;
    }
}

const refCache: Map<string, RefTooltipCacheEntry> = new Map();
const cacheTTL = 3600 * 1000; // 1h

// clears cache
const clearRefTooltipsCache = () => refCache.clear();

// sets the clear cache timeout for 1h
let clearRefTooltipsCacheTimeout;
const setClearRefTooltipsCacheTimeout = () => clearRefTooltipsCacheTimeout = window.setTimeout(clearRefTooltipsCache, cacheTTL);
setClearRefTooltipsCacheTimeout();

// resets cahe clear timout to 1h again (while using refs the cache is not cleared)
const resetClearRefTooltipsCacheTimeout = () => {
    window.clearTimeout(clearRefTooltipsCacheTimeout);
    setClearRefTooltipsCacheTimeout();
};
//#endregion

// common tooltip template
const tooltipContent = (header, itentifier, itentifierClass, content) => `
    <div class="tooltip">
        <div class="tooltip-header">
            <div class="tooltip-header-text">${header}</div>        
            <div class="tooltip-header-identifier ${itentifierClass}">${itentifier}</div>    
        </div>    
        <div class="tooltip-body">        
            <div class="tooltip-body-description">            
                ${content}
            </div>    
        </div>
    </div>
`;

// base locked/error tooltip template
const baseErrorContent = (content) => `
    <div class="ddb-blocked-content">
        <div class="ddb-blocked-content-body">
            <div class="ddb-blocked-content-body-text">
                <div class="ddb-blocked-content-body-text-main">
                    <span style="width: 400px; white-space: normal;">
                        <b>Beyond Help:</b>&nbsp;${content}
                    </span>
                </div>
            </div>
        </div>
    </div>
`;

const privateErrorContent = baseErrorContent("Error loading tooltip. This content is probably a private homebrew creation. If not try again reloading the page.");
const unknownErrorContent = baseErrorContent("Unknown error.");
const lockedMessage = (src: string) => `This content is part of the <span class="source">${src}</span> digital content pack. Please visit the marketplace for purchasing options.`;

const styleBodyBackgroundRegex = /body\s*{[^{}]+}/igm;

const srcTitleMap: Map<string, string> = new Map();
srcTitleMap.set("basic-rules", "Basic Rules");
srcTitleMap.set("dmg", "Dungeon Master's Guide");
srcTitleMap.set("mm", "Monster Manual");
srcTitleMap.set("phb", "Player's Handbook");
srcTitleMap.set("scag", "Sword Coast Adventurer's Guide");
srcTitleMap.set("ttp", "The Tortle Package");
srcTitleMap.set("vgtm", "Volo's Guide to Monsters");
srcTitleMap.set("xgte", "Xanathar's Guide to Everything");
srcTitleMap.set("cos", "Curse of Strahd");
srcTitleMap.set("hotdq", "Hoard of the Dragon Queen");
srcTitleMap.set("lmop", "Lost Mine of Phandelver");
srcTitleMap.set("oota", "Out of the Abyss");
srcTitleMap.set("pota", "Princes of the Apocalypse");
srcTitleMap.set("rot", "Rise of Tiamat");
srcTitleMap.set("skt", "Storm King's Thunder");
srcTitleMap.set("tftyp", "Tales from the Yawning Portal");
srcTitleMap.set("tftypa1", "The Sunless Citadel");
srcTitleMap.set("tftypa2", "The Forge of Fury");
srcTitleMap.set("tftypa3", "The Hidden Shrine of Tamoachan");
srcTitleMap.set("tftypa4", "White Plume Mountain");
srcTitleMap.set("tftypa5", "Dead in Thay");
srcTitleMap.set("tftypa6", "Against the Giants");
srcTitleMap.set("tftypa7", "Tomb of Horrors");
srcTitleMap.set("toa", "Tomb of Annihilation");

const buildBackgroundFeatTooltip = function ({ name, slug, type, itentifierClass }) {
    return new Promise((resolve, reject) => {
        const moreInfoUrl = `https://www.dndbeyond.com/characters/${type}/${slug}/more-info`;

        // gets the more-info content (same used on list expand) and parses the content to add on tooltip
        $.get(moreInfoUrl, (response) => {
            const jqHtml = $($.parseHTML(response));

            // if locked content found parses the more-info and builds the correct tooltip
            const jqLocked = jqHtml.find(".ddb-blocked-content");
            if (jqLocked.length > 0) {
                let content = "";
                const src = jqLocked.find(".ddb-blocked-content-body-text-main").text();
                if (src) {
                    content = lockedMessage(src);
                } else {
                    content = jqLocked.find(".ddb-blocked-content-body-text-secondary").text();
                }
                reject(baseErrorContent(content));
                return;
            }

            // if error 500 found parses the error messafe and builds the correct tooltip
            const jqError500 = jqHtml.find(".error-page-500");
            if (jqError500.length > 0) {
                reject(privateErrorContent);
                return;
            }

            // if other error type is found just gives a unknown error message
            const jqError = jqHtml.find(".error-page");
            if (jqError.length > 0) {
                reject(unknownErrorContent);
                return;
            }

            // for the common case just gets the more-info content
            let identifier;
            switch (type) {
                case "backgrounds":
                    identifier = "Background";
                    break;
                case "feats":
                    identifier = "Feat";
                    break;
                default:
                    identifier = "";
            }
            const content = jqHtml.find(".more-info-body").html();
            resolve(tooltipContent(name, identifier, itentifierClass, content));
        }).fail(() => {
            reject(unknownErrorContent);
        });
    });
};

const buildReferenceTooltip = function ({ refId, refUrl, src, subSrc, contentId }) {
    return new Promise((resolve, reject) => {
        // resets clear cache time
        resetClearRefTooltipsCacheTimeout();

        let srcTitle = srcTitleMap.get(src);
        if (src === "tftyp" && subSrc !== "app") srcTitle = srcTitleMap.get(src + subSrc);

        const innerBuildRef = (cacheEntry: RefTooltipCacheEntry) => {
            const contentArray = [];
            if (contentId && refId === "co") {
                // includes just the element with the content id
                const jqContent = cacheEntry.jqHTML.find(`[data-content-chunk-id='${contentId}']`);

                // max height to fit on tooltip container
                jqContent.css("max-height", "400px");
                jqContent.find("*").css("max-height", "400px");

                if (jqContent.length > 0) contentArray.push(jqContent[0].outerHTML);
            } else {
                // finds the header of the reference
                const jqHeader = cacheEntry.jqHTML.find("#" + refId);
                const header = jqHeader[0];
                contentArray.push(header.outerHTML);

                const tagName = header.tagName;

                // also adds the next 29 siblings from the header
                // or until finds a header of same type or bigger
                let untilSelector = "";
                if (tagName === "H1") {
                    untilSelector = "h1";
                } else if (tagName === "H2") {
                    untilSelector = "h1, h2";
                } else if (tagName === "H3") {
                    untilSelector = "h1, h2, h3";
                } else if (tagName === "H4") {
                    untilSelector = "h1, h2, h3, h4";
                } else {
                    untilSelector = "h1, h2, h3, h4, h5";
                }

                // if content id present start by the element with the content id
                const jqContentTarget = contentId ? cacheEntry.jqHTML.find(`[data-content-chunk-id='${contentId}']`) : jqHeader;
                if (contentId) contentArray.push(jqContentTarget[0].outerHTML);

                jqContentTarget.nextUntil(untilSelector).each((idx, el) => {
                    if (idx >= 29) return false;
                    if (el.tagName === "IMG") return;
                    $(el).find("img, .ddb-lightbox-outer").remove();
                    contentArray.push(el.outerHTML);
                });
            }

            const content = `
                ${cacheEntry.stylesArray.join("\n")}
                <div class="body-page BH-tooltip-reference-body">
                    <article class="p-article p-article-a">
                        <div class="p-article-content u-typography-format">
                            ${contentArray.join("\n")}
                        </div>
                    </article>
                </div>
            `;

            resolve(tooltipContent(cacheEntry.title, srcTitle, "", content));
        };

        // removes hash for cache purpose
        const hashIndex = refUrl.indexOf("#");
        if (hashIndex >= 0) {
            refUrl = refUrl.substring(0, hashIndex);
        }

        // page on cache just builds the tooltip
        if (refCache.has(refUrl)) {
            innerBuildRef(refCache.get(refUrl));
        }

        // page not on cache makes a request, caches it and builds the tooltip.
        $.get(refUrl, (response) => {
            const jqHtml = $($.parseHTML(response));

            // finds unique styles of this specific compendium page
            // later added on tooltip content
            // removes css rules that are applied to body to not 
            // affect the page where the tooltip is loaded
            const stylesArray = [];
            jqHtml.find("style").each((idx, el) => stylesArray.push(el.outerHTML.replace(styleBodyBackgroundRegex, "")));

            const title = jqHtml.find(".b-breadcrumb-item:last").text().trim();

            const cacheEntry = new RefTooltipCacheEntry(jqHtml, stylesArray, title);

            refCache.set(refUrl, cacheEntry);
            innerBuildRef(cacheEntry);
        }).fail((error) => {
            reject(error.status === 403 ? baseErrorContent(lockedMessage(srcTitle)) : unknownErrorContent);
        });
    });
};

class TooltipsService {
    /**
     * Workaround that adds the spell tooltip class to homebrew tooltips. 
     * For some reason after custom classes are removed on server after save the spell-tooltip is removed too.
     * And this do not happen with monsters and magic items.
     */
    static homebrewSpellTooltipWorkaround() {
        $(".tooltip-hover[href^='https://www.dndbeyond.com/spells/']").addClass("spell-tooltip");
    }

    /**
     * Inits extra tooltips on content page.
     */
    static bhTooltipsInit() {
        PageScriptService.runFile("loadbhtooltips.js");
    }

    /**
     * Listen for error on tooltip loading and gives a propper message.
     */
    static listenTooltipError() {
        MessageService.listen(C.TooltipErrorMessage, (message) => {
            var tooltip = JSON.stringify({
                Id: 0,
                SimpleOrAdvanced: "simple",
                Type: "blocked",
                Tooltip: privateErrorContent,
                Url: decodeURI(message.url)
            });
            PageScriptService.run(`Waterdeep.CurseTip.handleTooltipData(${tooltip})`);
        });
    }

    /**
     * Builds the content to show on a custom tooltip (Background, Feat or Reference)
     * @param {*} tooltipInfo 
     */
    static buildCustomTooltipContent(tooltipInfo): Promise<Object> {
        if (tooltipInfo.type === "compendium") {
            return buildReferenceTooltip(tooltipInfo);
        }
        return buildBackgroundFeatTooltip(tooltipInfo);

    }
}

export default TooltipsService;