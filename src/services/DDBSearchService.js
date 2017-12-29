
import $ from "jquery";
import HomebrewEntry from "../data/HomebrewEntry";

const url = (name: string, page: string, isHomebrew: boolean) => `https://www.dndbeyond.com${isHomebrew ? "/homebrew" : ""}/${page}?filter-search=${encodeURI(name)}&sort=name`;

const trim = (value: string) => value ? value.trim() : "";

const baseSearch = function (name: string, page: string, selector: string) {
    return new Promise((resolve, reject) => {
        $.get(url(name, page), (response) => {
            const html = $.parseHTML(response);
            const results = [];
            $(html).find(selector).each((idx, el) => results.push(trim(el.textContent)));
            resolve(results);
        }).fail(() => reject());
    });
};

const baseHomebrewSearch = function (name: string, page: string, selector: string) {
    return new Promise((resolve, reject) => {
        $.get(url(name, page, true), (response) => {
            const html = $.parseHTML(response);
            const results = [];
            $(html).find(selector).each((idx, el) => {
                const name = trim(el.textContent);
                const jqEl = $(el);
                const path = trim(jqEl.attr("href"));
                const author = trim(jqEl.closest(".list-row").find(".list-row-author-primary-text").text());
                results.push(new HomebrewEntry(name, path, author));
            });
            resolve(results);
        }).fail(() => reject());
    });
};

class DDBSearchService {
    static equipment(name: string): Promise<string[]> {
        return baseSearch(name, "equipment", ".list-row-name-primary-text a");
    }

    static magicItems(name: string): Promise<string[]> {
        return baseSearch(name, "magic-items", ".item-name a");
    }

    static monsters(name: string): Promise<string[]> {
        return baseSearch(name, "monsters", ".monster-name a");
    }

    static spells(name: string): Promise<string[]> {
        return baseSearch(name, "spells", ".spell-name a");
    }

    static homebrewMonsters(name: string): Promise<HomebrewEntry[]> {
        return baseHomebrewSearch(name, "monsters", ".list-row-name-primary-text a");
    }

    static homebrewMagicItems(name: string): Promise<HomebrewEntry[]> {
        return baseHomebrewSearch(name, "magic-items", ".list-row-name-primary-text a");
    }

    static homebrewSpells(name: string): Promise<HomebrewEntry[]> {
        return baseHomebrewSearch(name, "spells", ".list-row-name-primary-text a");
    }
}

export default DDBSearchService;