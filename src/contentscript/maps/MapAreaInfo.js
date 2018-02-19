class MapAreaInfo {
    constructor(id: string, coords: string, page: string, contentId: string, addBackLink: boolean = true, contentOnly: boolean, isCircle: boolean) {
        this.addBackLink = addBackLink && id && !page && !contentId; // should add a link to the map on the target of this area
        this.id = id || "";
        this.coords = coords;
        this.page = page;
        this.contentId = contentId;
        this.contentOnly = contentOnly;
        this.isCircle = isCircle;
    }

    content(contentId: string, untilContentId: string): MapAreaInfo {
        this.contentId = contentId;
        this.untilContentId = untilContentId;
        return this;
    }

    c(coords: string): MapAreaInfo {
        this.coords = coords;
        return this;
    }
}

export default MapAreaInfo;