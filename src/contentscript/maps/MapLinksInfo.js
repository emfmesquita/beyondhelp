class MapLinksInfo {
    constructor(fromPage: string, toPage: string, mapContentId: string, targetSelectors: string[]) {
        this.fromPage = fromPage;
        this.toPage = toPage;
        this.mapContentId = mapContentId;
        this.targetSelectors = targetSelectors || [];
    }

    map(targetImageName: string) {
        this.targetImageName = targetImageName;
        return this;
    }

    selector(selector: string) {
        this.targetSelectors = [selector];
        return this;
    }
}

export default MapLinksInfo;