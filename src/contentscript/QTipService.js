import $ from "jquery";
import PageScriptService from "../services/PageScriptService";

class QTipService {
    /**
     * Animates a tooltip into view.
     * @param {*} target The target to show the tooltip.
     * @param {*} content The content of the tooltip.
     * @param {*} hideDelay Time in millis to hide the tooltip, if zero hides only on unfocus.
     */
    static AnimateIntoQTip(target: JQuery<HTMLElement>, content: string, hideDelay: Number) {
        target.hide();
        target.fadeIn(300);
        const id = "bh-qtip-target-" + new Date().getTime();
        target.attr("id", id);
        const qtipOptions = {
            content: content,
            show: { event: "none", ready: true },
            hide: hideDelay ? { event: false, inactive: hideDelay } : { event: "unfocus" },
            position: {
                my: "bottom center",
                at: "top center"
            },
            style: { classes: "qtip-light BH-qtip" }
        };
        const qtipOptionsString = JSON.stringify(qtipOptions);
        // adds a script to run on the ddb page that adds the qtip
        PageScriptService.run(`$("#${id}").qtip(${qtipOptionsString})`);
    }
}

export default QTipService;