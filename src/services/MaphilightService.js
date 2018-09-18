import "maphilight";
// import "maphilight/jquery.maphilight.js";

import $ from "jquery";
import Coordinates from "../data/Coordinates";

const middle = (coord1: number, coord2: number) => Math.floor((coord1 + coord2) / 2);

class MaphilightService {
    static setup(jqMapImg: JQuery<HTMLElement>, alwaysOn: boolean) {
        // handle map ref highlights
        jqMapImg.maphilight({ alwaysOn, strokeWidth: 2 });

        // unfortunatelly the maphilight may use timeouts if the img is not loaded
        // so as a workaround we have to do the same until the highlight is processed
        const postInitSetup = () => {
            if (jqMapImg.hasClass("maphilighted")) {
                if (alwaysOn) {
                    // when alwaysOn is true maphilight adds two canvas, the first one is the always on
                    // and the main one should be hidden since is not used and may block drawing on the other canvas
                    jqMapImg.closest("a").find("canvas:nth-of-type(2)").css("display", "none");

                    return; // when alwaysOn no mouseover logic is needed
                }

                const jqAreas = jqMapImg.closest("a").find("area");
                jqMapImg.mouseover(() => jqAreas.mouseover()).mouseout(() => jqAreas.mouseout());
            } else {
                window.setTimeout(postInitSetup, 200);
            }
        };
        postInitSetup();
    }

    static unload(jqMapImg: JQuery<HTMLElement>) {
        const jqMaphilightDiv = jqMapImg.parent();
        const jqMapImgContainer = jqMaphilightDiv.parent();
        jqMapImgContainer.append(jqMapImg);
        jqMaphilightDiv.detach();
        jqMapImg.attr("style", "").removeClass("maphilighted");
    }

    static rect(x1: number, y1: number, x2: number, y2: number): Coordinates {
        return new Coordinates(x1, y1).add(x2, y2);
    }

    static rectToRho(x1: number, y1: number, x2: number, y2: number): Coordinates {
        const middleX = middle(x1, x2);
        const middleY = middle(y1, y2);
        return new Coordinates(middleX, y1).add(x2, middleY).add(middleX, y2).add(x1, middleY);
    }

    static rhoToRect(rho: Coordinates): Coordinates {
        return new Coordinates(rho.x(4), rho.y(1)).add(rho.x(2), rho.y(3));
    }

    static strRectToRho(rectCoords: string): Coordinates {
        const coords = Coordinates.parse(rectCoords);
        return MaphilightService.rectToRho(coords.x(1), coords.y(1), coords.x(2), coords.y(2));
    }

    static rectToCir(x1: number, y1: number, x2: number, y2: number): Coordinates {
        const x = Math.abs(x2 - x1);
        const y = Math.abs(y2 - y1);
        const r = Math.round(Math.sqrt(x * x + y * y));
        return new Coordinates(x1, y1).radius(r || 1);
    }
}

export default MaphilightService;