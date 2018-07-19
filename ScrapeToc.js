data = { adventures: {}, rules: {} };

function secondLevel(type, bookRefs, chapterRefs) {
    if (chapterRefs.length === 0) {
        topLevel(type, bookRefs.slice(1));
        return;
    }
    const go = chapterRefs[0];
    $.ajax(go, {
        url: go,
        dataType: "html",
        success: (response) => {
            console.log(go);
            function recurse(heads, arr, url) {
                if (heads.length === 0) return;
                const head = heads[0];
                const level = head.tagName.substr(1);
                heads.splice(0, 1);

                var title = head.innerText.trim();
                var anchor = "#" + head.id;
                var elem = { title: title, urlName: url, anchorName: anchor, subsections: [] };
                arr.push(elem);

                while (heads.length > 0) {
                    const next = heads[0];
                    const nextLevel = next.tagName.substr(1);
                    if (level < nextLevel) {
                        recurse(heads, elem.subsections, url);
                    } else if (level === nextLevel) {
                        recurse(heads, arr, url);
                    }
                    else return;
                }


            }


            const url = go.substr(37);
            var heads = $('#content', $(response)).find('h1, h2, h3, h4, h5').not('.quick-menu-exclude').get();
            while (heads.length > 0 && heads[0].tagName !== "H1") heads.splice(0, 1);

            recurse(heads, data[type][url.split("/")[1]].subsections, url);
            secondLevel(type, bookRefs, chapterRefs.slice(1));
        }
    });
}

function topLevel(type, hrefs) {
    if (hrefs.length === 0) {
        if (type === 'adventures') run('rules');
        return;
    }
    var go = hrefs[0];
    $.ajax(go, {
        url: go,
        success: (response) => {
            console.log(go);
            refs = [];
            if (go === 'https://www.dndbeyond.com/compendium/rules/ttp') {
                data[type]["ttp"] = { title: "The Tortle Package", urlName: 'rules/ttp', anchorName: "", subsections: [] };
                refs = ["https://www.dndbeyond.com/compendium/rules/ttp/the-tortle-package"];
            }
            else {
                const book = go.substr(go.lastIndexOf("/") + 1);
                const title = $("h1.page-title", $(response)).text().trim();
                data[type][book] = { title: title, urlName: `${type}/${book}`, anchorName: "", subsections: [] };
                if (type === "adventures")
                    refs = $('.adventure-chapter-header', $(response)).find('a').get().map(e => e.href);
                if (type === "rules")
                    refs = $("[data-chapter-slug]", $(response)).find('a').get().map(e => e.href);
            }
            secondLevel(type, hrefs, refs);
        }
    });
}
function run(type) {
    $.ajax(`https://www.dndbeyond.com/compendium/${type}`, {
        success: (response) => {
            var hrefs = $('.card-item-header-title', $(response)).find('a').get().map(e => e.href);
            topLevel(type, hrefs);

        }
    });
}
run('adventures');
