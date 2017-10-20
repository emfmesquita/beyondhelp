import Data from "./Data";

class Configuration extends Data {
    constructor(storageId: string) {
        super(storageId);
        this.activeEncounterId = null;
    }
}

export default Configuration;