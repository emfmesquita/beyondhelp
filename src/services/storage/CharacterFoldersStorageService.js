import CharacterFoldersData from '../../data/CharacterFoldersData';
import Q from "./Q";
import SyncStorageService from "./SyncStorageService";
import regeneratorRuntime from "regenerator-runtime";

/* global chrome */

const id = (owner: string, campaign: string) => "bh-charfolders-" + owner + (campaign ? "-" + campaign : "");

const insertNew = (data) => {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.set(data, () => {
            chrome.runtime.lastError ? reject(chrome.runtime.lastError) : resolve(data);
        });
    });
};

class CharacterFoldersStorageService {
    /**
     * Saves the structure of folders of my characters/campaing pages on storage.
     * @param {CharacterFoldersData} folders 
     * @param {string} owner User id of the owner user.
     * @param {string} campaign id of the campaign.
     */
    static saveCharacterFolders(folders: CharacterFoldersData, owner: string, campaign: string): Promise<CharacterFoldersData> {
        if (!folders.storageId) {
            folders.storageId = id(owner, campaign);
        }
        return SyncStorageService.createData(null, folders);
    }

    /**
     * Gets the structure of folders of my characters/campaing pages from storage.
     * @param {string} owner User id of the owner user.
     * @param {string} campaign id of the campaign.
     */
    static getCharacterFolders(owner: string, campaign: string): Promise<CharacterFoldersData> {
        return SyncStorageService.getData(id(owner, campaign));
    }

    static async migrateToId(username: String, id: string): Promise {
        const data = await SyncStorageService.getStorageData();
        // tries to find char foldes with old name
        const keysToMigrate = Object.keys(data).filter(key => key.startsWith(`bh-charfolders-${username}`));
        if (keysToMigrate.length === 0) return;

        // change the keys to new name username -> id
        const newKeys = keysToMigrate.map(key => key.replace(username, id));
        const newData = {};
        keysToMigrate.forEach((oldKey, idx) => {
            const newKey = newKeys[idx];
            newData[newKey] = data[oldKey];
            newData[newKey].storageId = newKey;
        });
        await insertNew(newData);
        await SyncStorageService.deleteData(keysToMigrate.map(key => ({ storageId: key })));
    }
}

export default CharacterFoldersStorageService;