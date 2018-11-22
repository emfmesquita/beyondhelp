(function (BeyondHelp) {
    const config = BeyondHelp.config;

    // inits a tooltip including:
    // - adds the tooltip classname
    // - adds a mouse over events that parses tooltip info and adds to global BeyondHelp object
    // - adds the get tooltip url
    // - calls Waterdeep api to watch mouseover
    const initTooltips = function (selector, className, parser) {
        const els = [];
        $(`${selector}:not(.${className})`)
            .addClass(className)
            .on("mouseover", function (e) {
                BeyondHelp.tooltip = parser(this);
                BeyondHelp.tooltip.itentifierClass = className + "-identifier";
            }).each((idx, el) => {
                const info = parser(el);
                el.dataset.tooltipCustom = "true";
                el.dataset.tooltipHref = `chrome-extension://${BeyondHelp.id}/webaccessible/beyondHelpTooltip.js?type=${info.type}&slug=${info.slug}`;
                els.push(el);
            });
        Waterdeep.CurseTip._watchElements(els);
    };

    if (BeyondHelp.config.customTooltips) {
        // parses tooltip info from tooltip anchor
        const parseTooltipInfo = function (tooltipEl) {
            // original feat/background name is saved on hash
            let href = tooltipEl.href;
            let originalText = "";
            const hashIndex = href.indexOf("#");
            if (hashIndex >= 0) {
                originalText = window.decodeURI(href.substring(hashIndex + 1)).trim();
                href = href.substring(0, hashIndex);
            }
            const tokens = href.split("/");
            return {
                cacheUrl: tooltipEl.dataset.tooltipHref,
                name: originalText || tooltipEl.textContent.trim(),
                slug: tokens[tokens.length - 1],
                type: tokens[tokens.length - 2]
            };
        };

        initTooltips(".tooltip-hover[href^='https://www.dndbeyond.com/characters/feats/']", "BH-feat-tooltip", parseTooltipInfo);
        initTooltips(".tooltip-hover[href^='https://www.dndbeyond.com/characters/backgrounds/']", "BH-background-tooltip", parseTooltipInfo);
    }


    // parses reference tooltip info from tooltip anchor
    const parseReference = function (referenceEl) {
        const tokens = referenceEl.pathname.split("/");
        const src = tokens[3];
        const page = tokens[tokens.length - 1];

        let refId, contentId, untilContentId, contentOnly = false;
        const fragmentTokens = referenceEl.hash.substring(1).split(":");
        if (referenceEl.hash.startsWith("#cid:co:")) {
            contentOnly = true;
            refId = fragmentTokens[2];
            contentId = fragmentTokens[3];
        } else if (referenceEl.hash.startsWith("#cid:")) {
            refId = fragmentTokens[1];
            contentId = fragmentTokens[2];
            untilContentId = fragmentTokens[3];
        } else {
            refId = fragmentTokens[0];
        }

        let slug = src + "-" + page + "-" + refId;
        if (contentId) slug += "-" + contentId;

        return {
            cacheUrl: referenceEl.dataset.tooltipHref,
            contentId: contentId,
            contentOnly: contentOnly,
            refId: refId,
            refUrl: referenceEl.href,
            slug: slug,
            src: src,
            subSrc: tokens.length === 6 ? tokens[4] : null,
            type: tokens[1],
            untilContentId: untilContentId
        };
    };

    const initRefTooltips = function (typeSelector) {
        initTooltips(`${typeSelector}.tooltip-hover[href^='https://www.dndbeyond.com/compendium/']`, "BH-reference-tooltip", parseReference);
    };

    // compendium references tooltips
    if (config.refTooltips) initRefTooltips(":not(.BH-map-ref):not(.BH-map-link):not(.BH-map-menu-link):not(.BH-map-toc-link)");
    // tooltips of main map references
    if (config.mapRefsRectTooltips) initRefTooltips(".BH-map-ref-rect");
    // tooltips of map to map references
    if (config.mapRefsCircTooltips) initRefTooltips(".BH-map-ref-circle");
    // tooltips of extra map references
    if (config.mapRefsRhoTooltips) initRefTooltips(".BH-map-ref-poly");
    // tooltips of header to map links
    if (config.mapLinksTooltips) initRefTooltips(".BH-map-link");
    // tooltips of menu to map links
    if (config.mapMenuLinksTooltips) initRefTooltips(".BH-map-menu-link");
    // tooltips of toc to map links
    if (config.mapTocLinksTooltips) initRefTooltips(".BH-map-toc-link");
})(BeyondHelp);