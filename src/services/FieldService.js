import { Component } from 'react';

class FieldService {
    /**
     * Creates a function that handles a enter keydown on a text field.
     * @param {Function} saveFunc 
     * @param {Component} caller 
     */
    static onEnterFunc(saveFunc: Function, caller: Component) {
        if (!saveFunc) return () => { };
        const func = function (e: KeyboardEvent) {
            if (e.which === 13 || e.keyCode === 13) {
                e.preventDefault();
                e.stopPropagation();
                saveFunc && saveFunc();
            }
        };
        return func.bind(caller);
    }

    /**
     * Creates a function that handles change of value on a field.
     * @param {string} stateKey 
     * @param {Component} caller 
     */
    static onChangeFunc(stateKey: string, caller: Component) {
        const func = function (e) {
            this.setState({ [stateKey]: e.target.value });
        };
        return func.bind(caller);
    }

    /**
     * Creates a function that handles change of color on a color picker.
     * @param {string} stateKey 
     * @param {Component} caller 
     */
    static onColorChangeFunc(stateKey: string, caller: Component) {
        const func = function (c) {
            this.setState({ [stateKey]: c.hex });
        };
        return func.bind(caller);
    }

    /**
     * Creates a function that handles a toggle of a color picker or checkbox.
     * @param {string} stateKey 
     * @param {Component} caller 
     */
    static onToggleFunc(stateKey: string, caller: Component) {
        const func = function (e) {
            this.setState((prev) => ({ [stateKey]: !prev[stateKey] }));
        };
        return func.bind(caller);
    }

    static onWheelFunc(stateKey: string, caller: Component) {
        const func = function (e) {
            e.preventDefault();
            e.stopPropagation();

            let intValue = Number.parseInt(caller.state[stateKey]);
            if (isNaN(intValue)) intValue = 0;

            const delta = e.deltaY;
            const change = delta > 0 ? -1 : 1;

            this.setState({ [stateKey]: intValue + change });
        };
        return func.bind(caller);
    }
}

export default FieldService;