import { Component } from 'react';

class FieldService {
    /**
     * Creates a function that handles a enter keydown on a text field.
     * @param {Function} saveFunc 
     * @param {Component} caller 
     */
    static onEnterFunc(saveFunc: Function, caller: Component) {
        if (!saveFunc) return () => { };
        let func = function (e: KeyboardEvent) {
            if (e.which === 13 || e.keyCode === 13) {
                saveFunc && saveFunc();
            }
        };
        func = func.bind(caller);
        return func;
    }

    /**
     * Creates a function that handles change of value on a field.
     * @param {string} stateKey 
     * @param {Component} caller 
     */
    static onChangeFunc(stateKey: string, caller: Component) {
        let func = function (e) {
            this.setState({ [stateKey]: e.target.value });
        };
        func = func.bind(caller);
        return func;
    }

    /**
     * Creates a function that handles change of color on a color picker.
     * @param {string} stateKey 
     * @param {Component} caller 
     */
    static onColorChangeFunc(stateKey: string, caller: Component) {
        let func = function (c) {
            this.setState({ [stateKey]: c.hex });
        };
        func = func.bind(caller);
        return func;
    }

    /**
     * Creates a function that handles a toggle of a color picker or checkbox.
     * @param {string} stateKey 
     * @param {Component} caller 
     */
    static onToggleFunc(stateKey: string, caller: Component) {
        let func = function (e) {
            this.setState((prev) => ({ [stateKey]: !prev[stateKey] }));
        };
        func = func.bind(caller);
        return func;
    }
}

export default FieldService;