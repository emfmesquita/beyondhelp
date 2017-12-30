
import $ from "jquery";
import HomebrewEntry from "../data/HomebrewEntry";

const url = (name: string, path: string) => `https://www.dndbeyond.com/${path}?filter-search=${encodeURI(name)}&sort=name`;
const collectionUrl = (name: string, type: string) => `https://www.dndbeyond.com/homebrew/collection?filter-type=${type}&filter-name=${name}&sort=name`;

const trim = (value: string) => value ? value.trim() : "";

const commonParse = (el: HTMLElement) => trim(el.textContent);

const homebrewListParse = function (el: HTMLElement) {
    const name = trim(el.textContent);
    const jqEl = $(el);
    const path = trim(jqEl.attr("href"));
    const author = trim(jqEl.closest(".list-row").find(".list-row-author-primary-text").text());
    return new HomebrewEntry(name, path, author);
};

const homebrewCollectionParse = function (el: HTMLElement) {
    const name = trim(el.textContent);
    const jqRow = $(el).closest(".list-row");
    const path = `/${jqRow.attr("data-type")}/${jqRow.attr("data-slug")}`;

    const authorText = jqRow.find(".list-row-name-secondary-text").text();
    const author = trim(authorText.substring(0, authorText.lastIndexOf("-")));

    const entry = new HomebrewEntry(name, path, author);
    entry.version = trim(jqRow.find(".list-row-version-primary-text").text());
    return entry;
};

const baseSearch = function (url: string, selector: string, parser: Function) {
    return new Promise((resolve, reject) => {
        $.get(url, (response) => {
            const html = $.parseHTML(response);
            const results = [];
            $(html).find(selector).each((idx, el) => results.push(parser(el)));
            resolve(results);
        }).fail(() => reject());
    });
};

const commonSearch = (url: string, selector: string) => baseSearch(url, selector, commonParse);
const homebreListSearch = (url: string, selector: string) => baseSearch(url, selector, homebrewListParse);
const homebreCollectionSearch = (url: string, selector: string) => baseSearch(url, selector, homebrewCollectionParse);

class DDBSearchService {
    static equipment(name: string): Promise<string[]> {
        return commonSearch(url(name, "equipment"), ".list-row-name-primary-text a");
    }

    static magicItems(name: string): Promise<string[]> {
        return commonSearch(url(name, "magic-items"), ".item-name a");
    }

    static monsters(name: string): Promise<string[]> {
        return commonSearch(url(name, "monsters"), ".monster-name a");
    }

    static spells(name: string): Promise<string[]> {
        return commonSearch(url(name, "spells"), ".spell-name a");
    }

    static homebrewMagicItems(name: string): Promise<HomebrewEntry[]> {
        return homebreListSearch(url(name, "homebrew/magic-items"), ".list-row-name-primary-text a");
    }

    static homebrewMonsters(name: string): Promise<HomebrewEntry[]> {
        return homebreListSearch(url(name, "homebrew/monsters"), ".list-row-name-primary-text a");
    }

    static homebrewSpells(name: string): Promise<HomebrewEntry[]> {
        return homebreListSearch(url(name, "homebrew/spells"), ".list-row-name-primary-text a");
    }

    static homebrewCollectionMagicItems(name: string): Promise<HomebrewEntry[]> {
        return homebreCollectionSearch(collectionUrl(name, "112130694"), ".list-row-name-primary-text a");
    }

    static homebrewCollectionMonsters(name: string): Promise<HomebrewEntry[]> {
        return homebreCollectionSearch(collectionUrl(name, "779871897"), ".list-row-name-primary-text a");
    }

    static homebrewCollectionSpells(name: string): Promise<HomebrewEntry[]> {
        return homebreCollectionSearch(collectionUrl(name, "1118725998"), ".list-row-name-primary-text a");
    }
}

export default DDBSearchService;