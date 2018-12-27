(() => {
    const data = { adventures: {}, rules: {} };

    const compendiums = [
        "https://www.dndbeyond.com/compendium/rules/phb",
        "https://www.dndbeyond.com/compendium/rules/dmg",
        "https://www.dndbeyond.com/compendium/rules/mm",
        "https://www.dndbeyond.com/compendium/rules/basic-rules",
        "https://www.dndbeyond.com/compendium/rules/ggtr",
        "https://www.dndbeyond.com/compendium/rules/mtof",
        "https://www.dndbeyond.com/compendium/rules/xgte",
        "https://www.dndbeyond.com/compendium/rules/vgtm",
        "https://www.dndbeyond.com/compendium/rules/scag",
        "https://www.dndbeyond.com/compendium/rules/wgte",
        "https://www.dndbeyond.com/compendium/rules/ttp",
        "https://www.dndbeyond.com/compendium/adventures/wdotmm",
        "https://www.dndbeyond.com/compendium/adventures/wdh",
        "https://www.dndbeyond.com/compendium/adventures/toa",
        "https://www.dndbeyond.com/compendium/adventures/tftyp",
        "https://www.dndbeyond.com/compendium/adventures/skt",
        "https://www.dndbeyond.com/compendium/adventures/cos",
        "https://www.dndbeyond.com/compendium/adventures/oota",
        "https://www.dndbeyond.com/compendium/adventures/pota",
        "https://www.dndbeyond.com/compendium/adventures/hotdq",
        "https://www.dndbeyond.com/compendium/adventures/rot",
        "https://www.dndbeyond.com/compendium/adventures/lmop",
        "https://www.dndbeyond.com/compendium/adventures/llok",
        "https://www.dndbeyond.com/compendium/adventures/ddia-mord"
    ];

    // run in https://www.dndbeyond.com/compendium/rules and https://www.dndbeyond.com/compendium/adventures
    const printCompendiuns = () => $('.card-item-header-title').find('a').get().map(e => e.href).forEach(a => console.log(a));

    const processChapters = (type, bookRefs, chapterRefs) => {
        if (chapterRefs.length === 0) {
            processBook(bookRefs.slice(1));
            return;
        }
        const chapterUrl = chapterRefs[0];
        $.ajax(chapterUrl, {
            url: chapterUrl,
            dataType: "html",
            success: (response) => {
                console.log(chapterUrl);
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

                const url = chapterUrl.substr(37);
                var heads = $('#content', $(response)).find('h1, h2, h3, h4, h5').not('.quick-menu-exclude').get();
                while (heads.length > 0 && heads[0].tagName !== "H1") heads.splice(0, 1);

                recurse(heads, data[type][url.split("/")[1]].subsections, url);
                processChapters(type, bookRefs, chapterRefs.slice(1));
            }
        });
    };

    const processBook = (hrefs) => {
        if (hrefs.length === 0) {
            ['adventures', 'rules'].forEach(type => {
                Object.keys(data[type]).forEach(e => {
                    const anchor = document.createElement("a");
                    const file = new Blob([JSON.stringify(data[type][e], null, '    ')], { type: 'application/json' });
                    anchor.href = URL.createObjectURL(file);
                    anchor.download = e + '.json';
                    anchor.click();
                });
            });
            return;
        }

        const compendiumUrl = hrefs[0];
        const compendiumUrlObj = new URL(compendiumUrl);
        const type = new URL(compendiumUrl).pathname.split("/")[2];

        $.ajax(compendiumUrl, {
            url: compendiumUrl,
            success: (response) => {
                console.log(compendiumUrl);
                refs = [];
                if (compendiumUrl === 'https://www.dndbeyond.com/compendium/rules/ttp') {
                    data[type]["ttp"] = { title: "The Tortle Package", urlName: 'rules/ttp', anchorName: "", subsections: [] };
                    refs = ["https://www.dndbeyond.com/compendium/rules/ttp/the-tortle-package"];
                }
                else {
                    const book = compendiumUrl.substr(compendiumUrl.lastIndexOf("/") + 1);
                    const title = $("h1.page-title", $(response)).text().trim();
                    data[type][book] = { title: title, urlName: `${type}/${book}`, anchorName: "", subsections: [] };

                    $("a", $(response)).get().forEach(a => {
                        if (!a.href.startsWith(compendiumUrl)) return;
                        const url = new URL(a.href);
                        if (url.pathname === compendiumUrlObj.pathname) return;
                        const chapterUrl = url.origin + url.pathname;
                        if (refs.indexOf(chapterUrl) === -1) refs.push(chapterUrl);
                    });
                }
                processChapters(type, hrefs, refs);
            }
        });
    };

    processBook(compendiums);
})();