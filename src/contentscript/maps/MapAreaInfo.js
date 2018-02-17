class MapAreaInfo {
    constructor(id: string, coords: string, page: string, contentId: string, addBackLink: boolean = true, contentOnly: boolean, isCircle: boolean) {
        this.addBackLink = addBackLink && !page && !contentId; // should add a link to the map on the target of this area
        this.id = id || "";
        this.coords = coords;
        this.page = page;
        this.contentId = contentId;
        this.contentOnly = contentOnly;
        this.isCircle = isCircle;
    }
}

export default MapAreaInfo;