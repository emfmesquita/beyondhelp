
import $ from "jquery";

const url = (name: string, page: string) => `https://www.dndbeyond.com/${page}?filter-search=${encodeURI(name)}&sort=name`;

const baseSearch = function (name: string, page: string, selector: string) {
    return new Promise((resolve, reject) => {
        $.get(url(name, page), (response) => {
            const html = $.parseHTML(response);
            const results = [];
            $(html).find(selector).each((idx, el) => results.push(el.textContent));
            resolve(results);
        }).fail(() => reject());
    });
};

class DDBSearchService {
    static magicItems(name: string): Promise<string[]> {
        return baseSearch(name, "magic-items", ".item-name a");
    }

    static equipment(name: string): Promise<string[]> {
        return baseSearch(name, "equipment", ".list-row-name-primary-text a");
    }

    static spells(name: string): Promise<string[]> {
        return baseSearch(name, "spells", ".spell-name a");
    }

    static monsters(name: string): Promise<string[]> {
        return baseSearch(name, "monsters", ".monster-name a");
    }
}

export default DDBSearchService;