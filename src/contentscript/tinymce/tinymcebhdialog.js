import ConfigStorageService from "../../services/storage/ConfigStorageService";
import React from 'react';
import ReactDOM from 'react-dom';
import TinyMCEApp from "./TinyMCEApp";
import Opt from "../../Options";

// disables scroll outside tinymce window iframe when cursor on it
const disableScrollOutsideFrame = function () {
    const trapClassName = "bh-disable-scroll";
    const trapSelector = ".bh-tinymce-dialog";

    const trapWheel = (e) => {
        const jqSelectMenu = $(e.target).closest(".Select-menu");
        if (jqSelectMenu.length === 0) return false;

        const dy = e.originalEvent.deltaY;
        let curScrollPos = jqSelectMenu.scrollTop();
        curScrollPos = curScrollPos > 0 ? Math.ceil(curScrollPos) : Math.floor(curScrollPos);
        const scrollableDist = jqSelectMenu[0].scrollHeight - jqSelectMenu.outerHeight();

        // only trap events once scrolled to the end or beginning
        if (dy > 0 && curScrollPos >= scrollableDist || dy < 0 && curScrollPos <= 0) {
            return false;
        }
    };

    $(document).on('wheel', trapWheel);
};

disableScrollOutsideFrame();

ConfigStorageService.getConfig().then(config => {
    ReactDOM.render(<TinyMCEApp addHomebrew={config[Opt.HomebrewTooltips]} addCustom={config[Opt.CustomTooltips]} />, document.getElementById('root'));
});

