/**
 * Handles colision of map links to avoid rendering the same map link multiple times.
 */
class MapLinksColisionHandler {
    constructor() {
        this.mapImagesBySelector = {};
    }

    check(selector: string, targetImageName: string): boolean {
        if (!this.mapImagesBySelector[selector]) {
            this.mapImagesBySelector[selector] = [];
        }
        const images: Array = this.mapImagesBySelector[selector];

        if (images.indexOf(targetImageName) !== -1) return true;
        images.push(targetImageName);
        return false;
    }
}

export default MapLinksColisionHandler;