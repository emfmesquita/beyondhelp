import { debounce, throttle } from "lodash";

let isShiftOnValue = false;
let isCtrlOnValue = false;
let isAltOnValue = false;
document.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.repeat) return;
    if (e.keyCode === 16) isShiftOnValue = true;
    if (e.keyCode === 17) isCtrlOnValue = true;
    if (e.keyCode === 18) isAltOnValue = true;
});
document.addEventListener("keyup", (e: KeyboardEvent) => {
    if (e.repeat) return;
    if (e.keyCode === 16) isShiftOnValue = false;
    if (e.keyCode === 17) isCtrlOnValue = false;
    if (e.keyCode === 18) isAltOnValue = false;
});

class KeyboardEventHandler {
    constructor(event: string) {
        this.event = event;
        this.keyCodeValues = [];
        this.codeValues = [];
        this.keyValues = [];
        this.noRepeatValue = false;
        this.propagateValue = false;
        this.ifHandler = null;
        this.throttleTimeout;
        this.debounceTimeout;
    }

    keyCodes(...keyCodeValues: number[]): KeyboardEventHandler {
        this.keyCodeValues = this.keyCodeValues.concat(keyCodeValues);
        return this;
    }

    codes(...codeValues: string[]): KeyboardEventHandler {
        this.codeValues = this.codeValues.concat(codeValues);
        return this;
    }

    keys(...keyValues: string[]): KeyboardEventHandler {
        this.keyValues = this.keyValues.concat(keyValues);
        return this;
    }

    noRepeat(): KeyboardEventHandler {
        this.noRepeatValue = true;
        return this;
    }

    propagate(): KeyboardEventHandler {
        this.propagateValue = true;
        return this;
    }

    throttle(timeout: number): KeyboardEventHandler {
        this.throttleTimeout = timeout;
        return this;
    }

    debounce(timeout: number): KeyboardEventHandler {
        this.debounceTimeout = timeout;
        return this;
    }

    IF(ifHandler: Function): KeyboardEventHandler {
        this.ifHandler = ifHandler;
        return this;
    }

    handler(handler: Function) {
        if (this.throttleTimeout !== undefined) {
            handler = throttle(handler, this.throttleTimeout);
        } else if (this.debounceTimeout !== undefined) {
            handler = debounce(handler, this.debounceTimeout);
        }

        document.addEventListener(this.event, (e: KeyboardEvent) => {
            if (e.repeat && this.noRepeatValue) return;

            let hit = false;
            if (this.keyCodeValues.indexOf(e.keyCode) !== -1) hit = true;
            else if (this.codeValues.indexOf(e.code) !== -1) hit = true;
            else if (this.keyValues.indexOf(e.key) !== -1) hit = true;
            if (!hit) return;

            if (this.ifHandler && !this.ifHandler(e)) return;

            if (!this.propagateValue) {
                e.preventDefault();
                e.stopPropagation();
            }

            return handler(e);
        });
    }
}

class KeyboardService {
    static isCtrlOn(): boolean {
        return isCtrlOnValue;
    }

    static isShiftOn(): boolean {
        return isShiftOnValue;
    }

    static isAltOn(): boolean {
        return isAltOnValue;
    }

    static down(): KeyboardEventHandler {
        return new KeyboardEventHandler("keydown");
    }

    static up(): KeyboardEventHandler {
        return new KeyboardEventHandler("keyup");
    }

    static press(): KeyboardEventHandler {
        return new KeyboardEventHandler("keypress");
    }
}

export default KeyboardService;