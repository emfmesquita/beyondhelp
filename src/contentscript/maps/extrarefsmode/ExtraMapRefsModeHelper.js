import { debounce, throttle } from "lodash";

import $ from "jquery";
import ExtraMapRefsModeTooltipInfo from "./ExtraMapRefsModeTooltipInfo";
import QTipService from "../../QTipService";
import ClipboardEntry from "../../../data/ClipboardEntry";
import ClipboardService from "../../../services/ClipboardService";
import HTMLUtils from "../../../services/HTMLUtils";

const qTipOptions = { hide: { event: "mouseleave" } };

//#region tooltip functions
const toolTipHeader = `<h5 style="font-size: 12px">Beyond Help - Extra Map References Info</h5>`;
const innerRow = (rowInfo, btn) => `${HTMLUtils.toBold(`${rowInfo.label}:`)}&nbsp;${rowInfo.text}&nbsp;${HTMLUtils.toBold(`(${btn} Click to Copy)`)}`;
const buildRow = (rowInfo, btn) => `<div style="text-align: left">${innerRow(rowInfo, btn)}</div>`;
const row = (rowInfo, btn) => rowInfo ? buildRow(rowInfo, btn) : "";

const addQTip = (info: ExtraMapRefsModeTooltipInfo) => {
    const htmlContent = `${toolTipHeader}${row(info.right, "Right")}${row(info.middle, "Middle")}`;
    QTipService.showQTip(info.target, htmlContent, qTipOptions);
};
//#endregion

//#region copy functions
const copyEntry = (text: string): ClipboardEntry[] => [new ClipboardEntry("text/plain", text)];
const copyCallBack = (target: JQuery<HTMLElement>): Function => {
    return () => QTipService.showQTip(target, HTMLUtils.toBold("Copied!"), qTipOptions);
};
const copy = (target: JQuery<HTMLElement>, text: string) => {
    ClipboardService.copy(copyEntry(text), copyCallBack(target));
};
//#endregion

// highlight an element and shows the tooltip
const enter = debounce((info: ExtraMapRefsModeTooltipInfo) => {
    if (!info.target.is(":hover")) return;
    info.target.css("box-shadow", "0px 0px 10px 0px black");
    addQTip(info);
}, 20);

class ExtraMapRefsModeHelper {

    static addCopyTooltip(info: ExtraMapRefsModeTooltipInfo) {
        let originalBoxShadow = "";

        const target = info.target;

        // handles copy on click
        target.mousedown((e) => {
            if (e.button !== 1 && e.button !== 2) return;
            if (info.middle && e.button === 1) {
                copy(target, info.middle.text);
                return false;
            }
            if (info.right && e.button === 2) {
                copy(target, info.right.text);
                return false;
            }
        });

        // removes menu on right click
        if (info.right) target.contextmenu(() => false);


        // now the logic that handles the highlight on mouse enter/leave

        // there is an extra logic for elements that have childs that are 
        // also highlightable

        // highlighs on enter and fire an event to alert parent
        target.mouseenter(() => {
            target.parent().trigger("childenter");
            originalBoxShadow = target.css("box-shadow");
            enter(info);
        });

        // handles a child leave but uses a timeout cancelable
        // for cases that mouses leave a child and enters another
        let reenterTimeout = null;
        target.on("childleave", () => {
            reenterTimeout = setTimeout(() => enter(info), 100);
        });

        const leave = () => target.css("box-shadow", originalBoxShadow);

        // removes the highlight and triggers event to alert parent
        target.mouseleave(() => {
            target.parent().trigger("childleave");
            leave();
        });

        target.on("childenter", () => {
            clearTimeout(reenterTimeout);
            leave();
            QTipService.hideQtip(target);
        });
    }
}

export default ExtraMapRefsModeHelper;