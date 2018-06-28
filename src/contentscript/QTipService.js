import $ from "jquery";
import PageScriptService from "../services/PageScriptService";


const addQtipId = (target: JQuery<HTMLElement>): string => {
    let id = target.attr("bh-qtip-id");
    if (!id) {
        id = new Date().getTime();
        target.attr("bh-qtip-id", id);
    }
    return id;
};

const addQTip = (target: JQuery<HTMLElement>, options: object) => {
    const qtipOptionsString = JSON.stringify(options);
    // adds a script to run on the ddb page that adds the qtip
    PageScriptService.run(`$("[bh-qtip-id='${addQtipId(target)}']").qtip(${qtipOptionsString})`);
};

const hideQTip = (target: JQuery<HTMLElement>) => {
    // adds a script to run on the ddb page that hides the qtip
    PageScriptService.run(`$("[bh-qtip-id='${addQtipId(target)}']").qtip("hide")`);
};

const defaultOptions = {
    show: { event: "none", ready: true },
    hide: { event: "unfocus" },
    position: {
        my: "bottom center",
        at: "top center"
    },
    style: { classes: "qtip-light BH-qtip" }
};

class QTipService {
    /**
     * Animates a tooltip into view.
     * @param {*} target The target to show the tooltip.
     * @param {*} content The content of the tooltip.
     * @param {*} hideDelay Time in millis to hide the tooltip, if zero hides only on unfocus.
     */
    static animateIntoQTip(target: JQuery<HTMLElement>, content: string, hideDelay: Number) {
        target.hide();
        target.fadeIn(300);

        const qtipOptions = { content };
        if (hideDelay) qtipOptions.hide = { event: false, inactive: hideDelay };

        addQTip(target, Object.assign({}, defaultOptions, qtipOptions));
    }

    /**
     * Shows a tooltip.
     * @param {*} target The target to show the tooltip.
     * @param {*} content The content of the tooltip.
     * @param {*} options Qtip Options.
     */
    static showQTip(target: JQuery<HTMLElement>, content: string, options: object = {}) {
        addQTip(target, Object.assign({}, defaultOptions, { content }, options));
    }

    /**
     * Hides a tooltip.
     * @param {*} target The target that has the tooltip.
     */
    static hideQtip(target: JQuery<HTMLElement>) {
        hideQTip(target);
    }
}

export default QTipService;