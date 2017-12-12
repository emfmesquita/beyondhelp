import CharacterFoldersData from '../../data/CharacterFoldersData';
import Q from "./Q";
import StorageService from "./StorageService";

class CharacterFoldersStorageService {
    /**
     * Saves the structure of folders of my characters page on storage.
     * @param {CharacterFoldersData} folders 
     * @param {string} owner Username of the owner user.
     */
    static saveMyCharactesFolders(folders: CharacterFoldersData, owner: string): Promise<CharacterFoldersData> {
        if (!folders.storageId) {
            folders.storageId = "bh-charfolders-" + owner;
        }
        return StorageService.createData(null, folders);
    }

    /**
     * Gets the structure of folders of my characters page from storage.
     * @param {string} owner Username of the owner user.
     */
    static getMyCharacterFolders(owner: string): Promise<CharacterFoldersData> {
        return StorageService.getData("bh-charfolders-" + owner);
    }
}

export default CharacterFoldersStorageService;