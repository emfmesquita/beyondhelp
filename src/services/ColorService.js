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
}

export default ColorService;