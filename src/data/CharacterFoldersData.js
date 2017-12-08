import CharacterFolderData from "./CharacterFolderData";
import Data from "./Data";

class CharacterFoldersData extends Data {
    constructor(storageId: string) {
        super(storageId);
        this.folders = [];
    }
}

export default CharacterFoldersData;