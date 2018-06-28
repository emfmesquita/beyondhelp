import $ from "jquery";
import ClipboardEntry from "../data/ClipboardEntry";
import { throttle } from "lodash";

const copyDummy = $(`<span id="bh-copy-dummy" style="display: none"/>`).prependTo($(document.body))[0];
let entries: ClipboardEntry[] = null;
let callback: Function = null;

const handleCopy = function (e: ClipboardEvent) {
    if (!entries) return;

    const data: DataTransfer = e.clipboardData;
    if (entries && Array.isArray(entries)) {
        entries.forEach(entry => data.setData(entry.format, entry.data));
    }
    entries = null;
    e.preventDefault();

    if (callback) {
        callback.call(this, e);
        callback = null;
    }
};

const copy = throttle((clipboardEntries: ClipboardEntry[], copyCallback: Function) => {
    // selects the dummy element and fires a copy
    const range = document.createRange();
    range.selectNodeContents(copyDummy);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);

    entries = clipboardEntries;
    callback = copyCallback;
    document.execCommand("copy");
}, 1000);


document.addEventListener("copy", handleCopy);

class ClipboardService {
    static copy = (clipboardEntries: ClipboardEntry[], copyCallback: Function) => {
        copy(clipboardEntries, copyCallback);
    }
}

export default ClipboardService;