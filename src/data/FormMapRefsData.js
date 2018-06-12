import Data from "./Data";
import C from "../Constants";

class FormMapRefsData extends Data {

    constructor(content: string) {
        super(C.FormMapRefsId);
        this.content = content;
    }
}

export default FormMapRefsData;