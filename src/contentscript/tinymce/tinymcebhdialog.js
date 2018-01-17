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
        const jqScrollable = $(e.target).closest(".Select-menu, .bh-tables-rows");
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

    $(document).on('wheel', trapWheel);
};

disableScrollOutsideFrame();

// listen for the response of selected table request
MessageService.listenFromClientPage(C.GetSelectedTableTinyMessage, message => {
    ConfigStorageService.getConfig().then(config => {
        ReactDOM.render(<TinyMCEApp addHomebrew={config[Opt.HomebrewTooltips]} addCustom={config[Opt.CustomTooltips]} tableHtml={message.tableHtml} />, document.getElementById('root'));
    });
});

// makes a selected table request
window.top.postMessage({ action: C.GetSelectedTableTinyMessage }, "*");