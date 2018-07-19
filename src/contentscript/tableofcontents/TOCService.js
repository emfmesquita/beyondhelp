import $ from "jquery";
import React from 'react';
import ReactDOM from 'react-dom';
import TOCApp from "./TOCApp";

import TOCData from "./TOCData.js";

class TOCService {
    static triggers() {
        $(".quick-menu-item-trigger").on("click", (evt) => {
            const isOpen = evt.delegateTarget.parentNode.parentElement.className.includes("quick-menu-item-opened");
            if (isOpen) {
                evt.delegateTarget.parentNode.parentElement.classList.replace("quick-menu-item-opened", "quick-menu-item-closed");
                $(evt.delegateTarget.parentNode.parentNode).find(".quick-menu-item-opened").each((idx, ele) =>
                    ele.classList.replace("quick-menu-item-opened", "quick-menu-item-closed"));
            }
            else {
                if (evt.delegateTarget.parentNode.parentNode.parentElement.className.includes("quick-menu-tier-1"))
                    $(evt.delegateTarget.parentNode.parentNode.parentNode).find(".quick-menu-item-opened").each((idx, ele) =>
                        ele.classList.replace("quick-menu-item-opened", "quick-menu-item-closed"));

                evt.delegateTarget.parentNode.parentElement.classList.replace("quick-menu-item-closed", "quick-menu-item-opened");
            }
        });
    }


    static init() {
        const path = window.location.pathname;
        const pathComponents = path.split("/");
        if (pathComponents.length < 5 || pathComponents[1] !== "compendium") return;
        const subPath = pathComponents.slice(2).join('/');
        const book = TOCData.getBook(pathComponents[2], pathComponents[3]);
        if (!book) return; // no entry on data, nothing to do
        const menu = $(".sidebar-menu");
        menu.empty();
        ReactDOM.render(<TOCApp object={book} currentUrl={subPath} />, menu[0]);
        this.triggers();
    }
}

export default TOCService;