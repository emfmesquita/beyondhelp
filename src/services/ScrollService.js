import { debounce, throttle } from 'lodash';

import ConfigStorageService from "./storage/ConfigStorageService";
import SyncStorageService from "./storage/SyncStorageService";

const clrearLoadTimeHeight = function () {
    document.body.style.height = null;
    document.body.removeEventListener("mouseenter", clrearLoadTimeHeight);
};

// clears the temporary height of page used to scroll before the page render
document.body.addEventListener("mouseenter", clrearLoadTimeHeight);

const updateScroll = debounce(() => {
    ConfigStorageService.getConfig().then(config => {
        config.scrollyoffset = window.pageYOffset || 0;
        // saves the current height of page to be able to scroll on load before render the page
        config.scrollpageheight = document.getElementById("bhroot").offsetHeight;
        SyncStorageService.updateData(config);
    });
}, 300);

class ScrollService {
    /**
     * Start watching for scroll changes and saves it on config.
     */
    static watchScrollChange() {
        window.addEventListener("scroll", updateScroll);
        window.addEventListener("resize", updateScroll);
    }

    /**
     * Loads saved scrollposition from storage.
     */
    static loadScrollPosition() {
        return ConfigStorageService.getConfig().then(config => {
            const position = config.scrollyoffset || 0;
            const height = config.scrollpageheight || 0;
            // temporally sets body height to the last saved height to be able to scroll before the page render
            document.body.style.height = height + "px";
            window.scrollTo(0, position);
        });
    }
}

export default ScrollService;