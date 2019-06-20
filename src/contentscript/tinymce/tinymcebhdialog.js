import C from "../../Constants";
import ConfigStorageService from "../../services/storage/ConfigStorageService";
import MessageService from "../../services/MessageService";
import Opt from "../../Options";
import React from 'react';
import ReactDOM from 'react-dom';
import TinyMCEApp from "./TinyMCEApp";

// disables scroll outside tinymce window iframe when cursor on it
const disableScrollOutsideFrame = function () {
    const trapClassName = "bh-disable-scroll";
    const trapSelector = ".bh-tinymce-dialog";

    const trapWheel = (e) => {
        const jqScrollable = $(e.target).closest(".bh-select__menu-list, .bh-tables-rows");
        if (jqScrollable.length === 0) return false;

        const dy = e.originalEvent.deltaY;
        let curScrollPos = jqScrollable.scrollTop();
        curScrollPos = curScrollPos > 0 ? Math.ceil(curScrollPos) : Math.floor(curScrollPos);
        const scrollableDist = jqScrollable[0].scrollHeight - jqScrollable.outerHeight();

        // only trap events once scrolled to the end or beginning
        if (dy > 0 && curScrollPos >= scrollableDist || dy < 0 && curScrollPos <= 0) {
            return false;
        }
    };

    document.addEventListener("wheel", trapWheel, { passive: false });
};

disableScrollOutsideFrame();

ConfigStorageService.getConfig().then(config => {
    const renderDialog = (tableHtml: string) => ReactDOM.render(<TinyMCEApp config={config} tableHtml={tableHtml} />, document.getElementById('root'));
    if (config[Opt.TablesTab]) {
        // listen for the response of selected table request
        MessageService.listenFromClientPage(C.GetSelectedTableTinyMessage, message => renderDialog(message.tableHtml));
        // makes a selected table request
        window.top.postMessage({ action: C.GetSelectedTableTinyMessage }, "*");
    } else {
        renderDialog("");
    }
});