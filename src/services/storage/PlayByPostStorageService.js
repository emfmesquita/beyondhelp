import C from "../../Constants";
import LocalStorageService from "./LocalStorageService";
import PlayByPostData from '../../data/PlayByPostData';
import Q from "./Q";
import type StorageData from "../../data/StorageData";
import SyncStorageService from "./SyncStorageService";

const id = (owner: string, threadid: string, threadname: string) => C.PbpRefsId + '-' + owner + "-" + threadid + "-" + threadname;

let storage = LocalStorageService;

class PlayByPostStorageService {

    /**
     * Changes the storage implementation
     * @param {string}
     */
    static setStorageMethod(type: string) {
        switch (type) {
            case "local":
            case "sync":
                storage.getStorageData().then(result => {
                    const pbpData = storage.find(result, Q.clazz('PlayByPostData'));
                    storage.deleteData(phpData).then(data => {
                        if (type === 'local') {
                            storage = LocalStorageService;
                        } else {
                            storage = SyncStorageService;
                        }
                        storage.createData(null, data);
                    });
                });
                break;
            default:
            //no-op
        }
    }

    /**
     * Get all campaign notes
     * @returns {Promise<StorageData>}
     */
    static getAllCampaignNotes(): Promise<PlayByPostData[]> {
        return storage.getStorageData().then((data) => {
            return storage.find(data, Q.clazz('PlayByPostData'));
        });
    }

    /**
     * Delete one or more campaign notes.  If null, does nothing
     * @param data
     */
    static deleteCampaignNotes(data: PlayByPostData | PlayByPostData[]) {
        if (!data) return;
        storage.deleteData(data);
    }

    /**
     * Saves the structure of folders of my characters/campaing pages on storage.
     * @param {CharacterFoldersData} folders 
     * @param {string} owner Username of the owner user.
     * @param {string} campaign id of the campaign.
     * @param {string} threadname the url safe thread name in the path
     * @param {string} the readable name of the thread
     */
    static saveCampaignNotes(data: PlayByPostData, owner: string, threadId: string, threadName: string, name: string): Promise<PlayByPostData> {
        if (!data.storageId) {
            data.storageId = id(owner, threadId, threadName);
            data.threadId = threadId;
            data.urlSafeThreadName = threadName;
            data.name = name;
            data.owner = owner;
        }
        return storage.createData(null, data);
    }

    /**
     * Gets the structure of folders of my characters/campaing pages from storage.
     * @param {string} owner Username of the owner user.
     * @param {string} campaign id of the campaign.
     */
    static getCampaignNotes(owner: string, threadid: string, threadname: string): Promise<PlayByPostData> {
        return storage.getData(id(owner, threadid, threadname));
    }
}

export default PlayByPostStorageService;