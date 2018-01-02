(function () {
    const info = BeyondHelp.tooltip;
    const moreInfoUrl = `https://www.dndbeyond.com/characters/${info.type}/${info.slug}/more-info`;

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

    const tooltip = {
        SimpleOrAdvanced: "simple",
        Tooltip: "",
        Url: document.location.protocol + info.url
    };

    $.get(moreInfoUrl, (response) => {
        const html = $.parseHTML(response);
        const content = $(html).find(".more-info-body-description").html();
        tooltip.Tooltip = tooltipContent(info.name, typeLabel, content);
        Waterdeep.CurseTip.handleTooltipData(tooltip);
    }).fail(() => Waterdeep.CurseTip.handleTooltipData(tooltip));


})(BeyondHelp);