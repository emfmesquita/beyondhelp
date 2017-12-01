import C from "../Constants";
import tinycolor from "tinycolor2";

class ColorService {
    static progressBarBackground(color: string) {
        const colorString = color || C.DefaultMonsterColor;
        const darkColorString = tinycolor(colorString).darken(20);
        return `linear-gradient(to bottom, ${colorString} 0%, ${darkColorString} 100%)`;
    }

    static progressBarTextColor(color: string) {
        return color || C.DefaultMonsterTextColor;
    }
}

export default ColorService;