class MapAreaInfo {
    constructor(id: string, cords: string, page: string, contentId: string, addBackLink: boolean = true) {
        this.addBackLink = addBackLink && !page && !contentId; // should add a link to the map on the target of this area
        this.id = id;
        this.cords = cords;
        this.page = page;
        this.contentId = contentId;
    }
}

export default MapAreaInfo;