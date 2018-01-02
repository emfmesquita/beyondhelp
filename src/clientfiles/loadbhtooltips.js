(function (BeyondHelp) {
    const parseTooltipInfo = function (tooltipEl) {
        const tokens = tooltipEl.getAttribute("href").split("/");
        return {
            name: tooltipEl.textContent.trim(),
            slug: tokens[tokens.length - 1],
            type: tokens[tokens.length - 2],
            url: tooltipEl.dataset.tooltipHref
        }
    }

    const initTooltips = function (selector, className) {
        const els = [];
        $(`${selector}:not(.${className})`)
            .addClass(className)
            .attr("data-tooltip-href", `chrome-extension://${BeyondHelp.id}/beyondHelpTooltip.js`)
            .on("mouseover", function (e) {
                BeyondHelp.tooltip = parseTooltipInfo(this);
                BeyondHelp.tooltip.itentifierClass = className + "-identifier";
            }).each((idx, el) => {
                const info = parseTooltipInfo(el);
                el.dataset.tooltipCustom = "true";
                el.dataset.tooltipHref = `chrome-extension://${BeyondHelp.id}/beyondHelpTooltip.js?type=${info.type}&slug=${info.slug}`;
                els.push(el);
            });
        Waterdeep.CurseTip._watchElements(els);
    }

    initTooltips(".tooltip-hover[href^='https://www.dndbeyond.com/characters/feats/']", "BH-feat-tooltip");
    initTooltips(".tooltip-hover[href^='https://www.dndbeyond.com/characters/backgrounds/']", "BH-background-tooltip");
})(BeyondHelp);