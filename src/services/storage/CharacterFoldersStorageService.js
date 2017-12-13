import CharacterFoldersData from '../../data/CharacterFoldersData';
import Q from "./Q";
import StorageService from "./StorageService";

const id = (owner: string, campaign: string) => "bh-charfolders-" + owner + (campaign ? "-" + campaign : "");

class CharacterFoldersStorageService {
    /**
     * Saves the structure of folders of my characters/campaing pages on storage.
     * @param {CharacterFoldersData} folders 
     * @param {string} owner Username of the owner user.
     * @param {string} campaign id of the campaign.
     */
    static saveCharacterFolders(folders: CharacterFoldersData, owner: string, campaign: string): Promise<CharacterFoldersData> {
        if (!folders.storageId) {
            folders.storageId = id(owner, campaign);
        }
        return StorageService.createData(null, folders);
    }

    /**
     * Gets the structure of folders of my characters/campaing pages from storage.
     * @param {string} owner Username of the owner user.
     * @param {string} campaign id of the campaign.
     */
    static getCharacterFolders(owner: string, campaign: string): Promise<CharacterFoldersData> {
        return StorageService.getData(id(owner, campaign));
    }
}

export default CharacterFoldersStorageService;