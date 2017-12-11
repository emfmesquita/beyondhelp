import C from "../Constants";
import { Component } from 'react';
import tinycolor from "tinycolor2";

class ColorService {
    static progressBarBackground(color: string) {
        color = color || C.DefaultMonsterColor;
        return `linear-gradient(to bottom, ${color} 0%, ${tinycolor(color).darken(20)} 100%)`;
    }

    static progressBarTextColor(color: string) {
        return color || C.DefaultMonsterTextColor;
    }

    static listHeaderTextColor(color: string) {
        return color || C.DefaultListHeaderColor;
    }

    /**
     * Creates a function that handles change of color on a color picker.
     * @param {string} stateKey 
     * @param {Component} caller 
     */
    static onChangeFunc(stateKey: string, caller: Component) {
        let func = function (c) {
            this.setState({ [stateKey]: c.hex });
        };
        func = func.bind(caller);
        return func;
    }

    /**
     * Creates a function that handles a toggle of a color picker.
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

export default ColorService;