import Data from "./Data";
import Opt from "../Options";

class Configuration extends Data {
    constructor(storageId: string) {
        super(storageId);
        this.activeEncounterId = null;

        Opt.AllOptions.forEach(opt => this[opt] = Configuration.initialValue(opt));

        this.scrollyoffset = 0;
        this.scrollpageheight = 0;
    }

    static initialValue(configKey: string) {
        return configKey !== Opt.ExtraMapRefsMode;
    }
}

export default Configuration;