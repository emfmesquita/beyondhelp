import { Component } from 'react';

class TextFieldService {
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
     * Creates a function that handles change of value on a text field.
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
}

export default TextFieldService;