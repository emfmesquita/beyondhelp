import PlayByPostData from '../../data/PlayByPostData';
import Q from "./Q";
import StorageService from "./StorageService";

const id = (owner: string, threadid: string, threadname: string) => "pbp-thread-" + owner + "-" + threadid + "-" + threadname;

class PlayByPostStorageService {
    /**
     * Saves the structure of folders of my characters/campaing pages on storage.
     * @param {CharacterFoldersData} folders 
     * @param {string} owner Username of the owner user.
     * @param {string} campaign id of the campaign.
     */
    static saveCampaignNotes(data: PlayByPostData, owner: string, threadid: string, threadname: string): Promise<PlayByPostData> {
        if (!data.storageId) {
            data.storageId = id(owner, threadid, threadname);
        }
        return StorageService.createData(null, data);
    }

    /**
     * Gets the structure of folders of my characters/campaing pages from storage.
     * @param {string} owner Username of the owner user.
     * @param {string} campaign id of the campaign.
     */
    static getCampaignNotes(owner: string, threadid: string, threadname: string): Promise<PlayByPostData> {
        return StorageService.getData(id(owner, threadid, threadname));
    }
}

export default PlayByPostStorageService;