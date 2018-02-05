import MapInfoEntry from "./MapInfoEntry";

class MapInfo {
    constructor(page: string, name: string, entries: MapInfoEntry[]) {
        this.page = page;
        this.name = name;
        this.id = name.replace(/\W/g, "");
        this.entries = entries;
    }
}

export default MapInfo;