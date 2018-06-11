import CharacterFolderData from "./CharacterFolderData";
import Data from "./Data";

class PlayByPostData extends Data {
    constructor(storageId: string) {
        super(storageId);
        this.notes = '';
    }
}

export default PlayByPostData;