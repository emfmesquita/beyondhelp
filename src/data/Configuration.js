import Data from "./Data";

class Configuration extends Data {
    constructor(storageId: string) {
        super(storageId);
        this.activeEncounterId = null;
        this.addmonsteronlist = true;
        this.addmonsteronhlist = true;
        this.addmonsterondetail = true;
        this.tableroll = true;
        this.charfavicon = true;
        this.mycharacterfolders = true;
        this.campaigncharacterfolders = true;
    }
}

export default Configuration;