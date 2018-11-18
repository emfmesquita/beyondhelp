import C from "../../../../Constants";
import Color from "color";
import Configuration from "../../../../data/Configuration";
import DrawingAreaInfo from "./DrawingAreaInfo";
import ExtraMapRefsData from "../../../../data/ExtraMapRefsData";
import ExtraMapRefsPathService from "../ExtraMapRefsPathService";
import ExtraMapRefsStorageService from "../../../../services/storage/ExtraMapRefsStorageService";
import Opt from "../../../../Options";

let ancestorsColor, mapColors, areaColors;

const reset = () => {
    ancestorsColor = null;
    mapColors = {};
    areaColors = {};
};
reset();

const getColor = (bundle: ExtraMapRefsData, compendium, map): string => {
    if (map && map.color) return map.color;
    if (compendium && compendium.color) return compendium.color;
    if (bundle && bundle.content && bundle.content.color) return bundle.content.color;
    return null;
};

const defaultColor = (drawable: boolean) => drawable ? C.DDBColors.green : C.DDBColors.red;

/**
 * Service that reads extra map refs from storage and calculates the color
 * for drawing new areas on each map of the current bundle + compendium
 */
class DrawingColorService {
    static init(config: Configuration, bundles: ExtraMapRefsData[]) {
        reset();

        if (!bundles || !Array.isArray(bundles) || bundles.length === 0) return;

        const drawingBundleId = config[Opt.ExtraMapRefsDrawingBundle];
        if (!drawingBundleId) return;

        const bundle = bundles.find(bundle => bundle.storageId === drawingBundleId);
        if (!bundle) return;

        ancestorsColor = getColor(bundle); // set the colors in case no compendium exists

        const content = bundle.content;
        if (!content || !content.compendiums || !Array.isArray(content.compendiums)) return;

        const path = ExtraMapRefsPathService.currentPageInfo().path;

        const compendium = content.compendiums.find(compendium => compendium.path === path);
        ancestorsColor = getColor(bundle, compendium); // set the colors in case no maps exists
        if (!compendium || !compendium.maps || !Array.isArray(compendium.maps)) return;

        compendium.maps.forEach(map => {
            if (!map || !map.mapImageName) return;
            const mapColor = getColor(bundle, compendium, map);
            mapColors[map.mapImageName] = mapColor;

            if (!map.areas || !Array.isArray(map.areas)) return;
            map.areas.forEach(area => {
                if (!area || !area.id) return;
                areaColors[area.id] = area.color || mapColor;
            });
        });
    }

    static calcColor(bundle: ExtraMapRefsData, compendium, map, area, drawable: boolean): string {
        if (area.color) return area.color;
        const color = getColor(bundle, compendium, map);
        if (color) return color;
        return defaultColor(drawable);
    }

    static getColor(areaInfo: DrawingAreaInfo) {
        return areaColors[areaInfo.id] || mapColors[areaInfo.mapName] || ancestorsColor || defaultColor(true);
    }

    static toHighlightColor(colorStr: string): string {
        let color = Color(colorStr);
        const lightness = color.lightness();
        const newLightness = lightness >= 50 ? lightness - 20 : lightness + 20;
        return Color.hsl(color.hue(), color.saturationl(), newLightness).hex();
    }
}

export default DrawingColorService;