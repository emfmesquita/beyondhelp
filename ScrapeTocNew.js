(() => {
    const data = {};

    const compendiums = [
        "https://www.dndbeyond.com/sources/ai",
        "https://www.dndbeyond.com/sources/gos"
    ];

    // run in https://www.dndbeyond.com/sources
    const printCompendiuns = () => $('.card-item-header-title').find('a').get().map(e => e.href).forEach(a => console.log(a));

    const processChapters = (bookRefs, chapterRefs) => {
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

                recurse(heads, data[url.split("/")[1]].subsections, url);
                processChapters(bookRefs, chapterRefs.slice(1));
            }
        });
    };

    const processBook = (hrefs) => {
        if (hrefs.length === 0) {
            Object.keys(data).forEach(e => {
                const anchor = document.createElement("a");
                const file = new Blob([JSON.stringify(data[e], null, '    ')], { type: 'application/json' });
                anchor.href = URL.createObjectURL(file);
                anchor.download = e + '.json';
                anchor.click();
            });
            return;
        }

        const compendiumUrl = hrefs[0];
        const compendiumUrlObj = new URL(compendiumUrl);

        $.ajax(compendiumUrl, {
            url: compendiumUrl,
            success: (response) => {
                console.log(compendiumUrl);
                refs = [];

                const book = compendiumUrl.substr(compendiumUrl.lastIndexOf("/") + 1);
                const title = $("h1.page-title", $(response)).text().trim();
                data[book] = { title: title, urlName: `${book}`, anchorName: "", subsections: [] };

                $("a", $(response)).get().forEach(a => {
                    if (!a.href.startsWith(compendiumUrl)) return;
                    const url = new URL(a.href);
                    if (url.pathname === compendiumUrlObj.pathname) return;
                    const chapterUrl = url.origin + url.pathname;
                    if (refs.indexOf(chapterUrl) === -1) refs.push(chapterUrl);
                });
                processChapters(hrefs, refs);
            }
        });
    };

    processBook(compendiums);
})();