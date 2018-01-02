(function () {
    // This info is set when a mouseover occurs.
    // It is important to save this info on another variable because during the time one tooltip
    // is loading this info can change on the global BeyondHelp object.
    const info = BeyondHelp.tooltip;

    const moreInfoUrl = `https://www.dndbeyond.com/characters/${info.type}/${info.slug}/more-info`;

    // common tooltip template
    const tooltipContent = (name, typeLabel, content) => `
        <div class="tooltip">
            <div class="tooltip-header">
                <div class="tooltip-header-text">${name}</div>        
                <div class="tooltip-header-identifier ${info.itentifierClass}">${typeLabel}</div>    
            </div>    
            <div class="tooltip-body">        
                <div class="tooltip-body-description">            
                    ${content}
                </div>    
            </div>
        </div>
    `;

    // locked/error tooltip template
    const lockedtooltipContent = (content) => `
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

    const tooltip = {
        SimpleOrAdvanced: "simple",
        Tooltip: "",
        Url: document.location.protocol + info.url
    };

    // gets the more-info content (same used on list expand) and parses the content to add on tooltip
    $.get(moreInfoUrl, (response) => {
        const jqHtml = $($.parseHTML(response));

        // if locked content found parses the more-info and builds the correct tooltip
        const jqLocked = jqHtml.find(".ddb-blocked-content");
        if (jqLocked.length > 0) {
            let content = "";
            const src = jqLocked.find(".ddb-blocked-content-body-text-main").text();
            if (src) {
                content = `This content is part of the <span class="source">${src}</span> digital content pack. Please visit the marketplace for purchasing options.`
            } else {
                content = jqLocked.find(".ddb-blocked-content-body-text-secondary").text();
            }

            tooltip.Tooltip = lockedtooltipContent(content);
            Waterdeep.CurseTip.handleTooltipData(tooltip);
            return;
        }

        // if error 500 found parses the error messafe and builds the correct tooltip
        const jqError500 = jqHtml.find(".error-page-500");
        if (jqError500.length > 0) {
            tooltip.Tooltip = lockedtooltipContent("Error loading tooltip. This content is probably a private homebrew creation. If not try again reloading the page.");
            Waterdeep.CurseTip.handleTooltipData(tooltip);
            return;
        }

        // if other error type is found just gives a unknown error message
        const jqError = jqHtml.find(".error-page");
        if (jqError.length > 0) {
            tooltip.Tooltip = locked("Unknown error.");
            Waterdeep.CurseTip.handleTooltipData(tooltip);
            return;
        }

        // for the common case just gets the more-info content and adds to the tooltip template
        let typeLabel;
        switch (BeyondHelp.tooltip.type) {
            case "backgrounds":
                typeLabel = "Background";
                break;
            case "feats":
                typeLabel = "Feat";
                break;
            default:
                typeLabel = "";
        }

        const content = jqHtml.find(".more-info-body-description").html();
        tooltip.Tooltip = tooltipContent(info.name, typeLabel, content);
        Waterdeep.CurseTip.handleTooltipData(tooltip);
    }).fail(() => {
        tooltip.Tooltip = locked("Unknown error.");
        Waterdeep.CurseTip.handleTooltipData(tooltip)
    });


})(BeyondHelp);