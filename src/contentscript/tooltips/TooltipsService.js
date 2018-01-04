import $ from "jquery";
import C from "../../Constants";
import MessageService from "../../services/MessageService";
import PageScriptService from "../../services/PageScriptService";

/* global chrome */

// common tooltip template
const tooltipContent = (name, itentifier, itentifierClass, content) => `
    <div class="tooltip">
        <div class="tooltip-header">
            <div class="tooltip-header-text">${name}</div>        
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

    static buildCustomTooltipContent({ name, slug, type, itentifierClass }): Promise<Object> {
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
                        content = `This content is part of the <span class="source">${src}</span> digital content pack. Please visit the marketplace for purchasing options.`;
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
    }
}

export default TooltipsService;