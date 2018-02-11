import MapAreaInfo from "./MapAreaInfo";

class MapToMapAreaInfo extends MapAreaInfo {
    constructor(id: string, page: string, contentId: string, x: number, y: number, size: number, icon: string) {
        super(id, `${x},${y},${x + size},${y + size}`, page, contentId, false, true);
        this.x = x;
        this.y = y;
        this.size = size;
        this.icon = icon;
    }
}

export default MapToMapAreaInfo;