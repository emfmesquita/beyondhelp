import $ from "jquery";

const menuName = ".quick-menu-tier-1";

const data = [
    {
        title: "Princes of the ApocalypseE",
        url: "adventures/pota",
        chapters: [
            { key: "rise-of-elemental-evil", value: "Ch. 1: Rise of Elemental Evil" },
            { key: "the-dessarin-valley", value: "Ch. 2: The Dessarin Valley" },
            { key: "secret-of-the-sumber-hills", value: "Ch. 3: Secret of the Sumber Hills" },
            { key: "air-earth-fire-and-water", value: "Ch. 4: Air, Earth, Fire, Water" },
            { key: "temple-of-the-elder-elemental-eye", value: "Ch. 5: Temple of the Elder Elemental Eye" },
            { key: "alarums-and-excursions", value: "Ch. 6: Alarums and Excursions" },
            { key: "monsters-and-magic-items", value: "Ch. 7: Monsters and Magic Items" },
            { key: "appendix-a-genasi", value: "Appendix A: Genasi" },
            { key: "appendix-b-spells", value: "Appendix B: Spells" },
            { key: "appendix-c-adapting-to-other-worlds", value: "Appendix C: Adapting to Other Worlds" },
            { key: "afterword", value: "Afterword" },
            { key: "credits", value: "Credits" }
        ]
    }
];

class TableOfContentsService {
    static init() {
        const path = window.location.pathname;
        if (!path.startsWith("/compendium/") || path.split("/").length < 5) return;
        const subpath = path.substr(12);
        var book = data.find(e => subpath.startsWith(e.url));
        var anchorLoc = subpath.indexOf("#");
        if (anchorLoc < 0) anchorLoc = subpath.length;
        var chapter = subpath.substring(book.url.length + 1, anchorLoc);

        const menu = $(menuName)[0];

        const index = book.chapters.findIndex(e => e.key === chapter);

        book.chapters.slice(0, index).forEach(e =>
            menu.parentNode.insertBefore($(`<ul class="quick-menu quick-menu-tier-1">
            <li class="quick-menu-item quick-menu-item-opened quick-menu-item-active">
              <div class="quick-menu-item-label">
                <a class="quick-menu-item-link" href="https://www.dndbeyond.com/compendium/${book.url}/${e.key}">
                  ${e.value}
                </a>
              </div>
            </li>
          </ul>`)[0], menu)
        );
        book.chapters.slice(index + 1).forEach(e =>
            menu.parentNode.append($(`<ul class="quick-menu quick-menu-tier-1">
            <li class="quick-menu-item quick-menu-item-opened quick-menu-item-active">
              <div class="quick-menu-item-label">
                <a class="quick-menu-item-link" href="https://www.dndbeyond.com/compendium/${book.url}/${e.key}">
                  ${e.value}
                </a>
              </div>
            </li>
          </ul>`)[0])
        );
    }
}

export default TableOfContentsService;