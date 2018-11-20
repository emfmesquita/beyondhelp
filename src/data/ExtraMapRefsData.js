import Data from "./Data";

class ExtraMapRefsData extends Data {
    constructor(storageId: string, content: object) {
        super(storageId);
        this.content = content;
        this.valid = true;
        this.hidden = false;
    }
}

export default ExtraMapRefsData;