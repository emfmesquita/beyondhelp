import Data from "./Data";
import Opt from "../Options";

class Configuration extends Data {
    constructor(storageId: string) {
        super(storageId);
        this.activeEncounterId = null;

        Opt.AllOptions.forEach(opt => this[opt] = true);

        this.scrollyoffset = 0;
        this.scrollpageheight = 0;
    }
}

export default Configuration;