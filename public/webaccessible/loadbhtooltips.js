(function (BeyondHelp) {
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
            const tokens = tooltipEl.href.split("/");
            return {
                cacheUrl: tooltipEl.dataset.tooltipHref,
                name: tooltipEl.textContent.trim(),
                slug: tokens[tokens.length - 1],
                type: tokens[tokens.length - 2]
            };
        };

        initTooltips(".tooltip-hover[href^='https://www.dndbeyond.com/characters/feats/']", "BH-feat-tooltip", parseTooltipInfo);
        initTooltips(".tooltip-hover[href^='https://www.dndbeyond.com/characters/backgrounds/']", "BH-background-tooltip", parseTooltipInfo);
    }

    if (BeyondHelp.config.refTooltips) {
        // parses reference tooltip info from tooltip anchor
        const parseReference = function (referenceEl) {
            const tokens = referenceEl.pathname.split("/");
            const src = tokens[3];
            const page = tokens[tokens.length - 1];

            let refId, contentId;
            const fragmentTokens = referenceEl.hash.substring(1).split(":");
            if (referenceEl.hash.startsWith("#cid:")) {
                refId = fragmentTokens[1];
                contentId = fragmentTokens[2];
            } else {
                refId = fragmentTokens[0];
            }

            let slug = src + "-" + page + "-" + refId;
            if (contentId) slug += "-" + contentId;

            return {
                cacheUrl: referenceEl.dataset.tooltipHref,
                contentId: contentId,
                refId: refId,
                refUrl: referenceEl.href,
                slug: slug,
                src: src,
                subSrc: tokens.length === 6 ? tokens[4] : null,
                type: tokens[1]
            };
        };

        initTooltips(".tooltip-hover[href^='https://www.dndbeyond.com/compendium/']", "BH-reference-tooltip", parseReference);
    }
})(BeyondHelp);