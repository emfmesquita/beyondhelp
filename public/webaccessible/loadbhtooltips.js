(function (BeyondHelp) {

    // parses tooltip info from tooltip anchor
    const parseTooltipInfo = function (tooltipEl) {
        const tokens = tooltipEl.getAttribute("href").split("/");
        return {
            name: tooltipEl.textContent.trim(),
            slug: tokens[tokens.length - 1],
            type: tokens[tokens.length - 2],
            url: tooltipEl.dataset.tooltipHref
        };
    };

    // inits a tooltip including:
    // - adds the tooltip classname
    // - adds a mouse over events that parses tooltip info and adds to global BeyondHelp object
    // - adds the get tooltip url
    // - calls Waterdeep api to watch mouseover
    const initTooltips = function (selector, className) {
        const els = [];
        $(`${selector}:not(.${className})`)
            .addClass(className)
            .on("mouseover", function (e) {
                BeyondHelp.tooltip = parseTooltipInfo(this);
                BeyondHelp.tooltip.itentifierClass = className + "-identifier";
            }).each((idx, el) => {
                const info = parseTooltipInfo(el);
                el.dataset.tooltipCustom = "true";
                el.dataset.tooltipHref = `chrome-extension://${BeyondHelp.id}/webaccessible/beyondHelpTooltip.js?type=${info.type}&slug=${info.slug}`;
                els.push(el);
            });
        Waterdeep.CurseTip._watchElements(els);
    };

    initTooltips(".tooltip-hover[href^='https://www.dndbeyond.com/characters/feats/']", "BH-feat-tooltip");
    initTooltips(".tooltip-hover[href^='https://www.dndbeyond.com/characters/backgrounds/']", "BH-background-tooltip");
})(BeyondHelp);