class MapLinksInfo {
    constructor(fromPage: string, toPage: string, mapContentId: string, targetSelectors: string[]) {
        this.fromPage = fromPage;
        this.toPage = toPage;
        this.mapContentId = mapContentId;
        this.targetSelectors = targetSelectors;
    }
}

export default MapLinksInfo;