import Data from "../../data/Data";
import Storage from "./Storage";
import type StorageData from "../../data/StorageData";

/* global chrome */

const storage = new Storage(chrome.storage.local);

class LocalStorageService {

    static getData(id: string): Promise<Data> {
        return storage.getData(id);
    }

    /**
     * @param {string} id If null get all entries.
     */
    static getStorageData(id: string): Promise<StorageData> {
        return storage.getStorageData(id);
    }

    static findSingle(storageData: StorageData, ...queries): Data {
        return storage.findSingle(storageData, ...queries);
    }

    static find(storageData: StorageData, ...queries): Data[] {
        return storage.find(storageData, ...queries);
    }

    static findGroupedBy(storageData: StorageData, groupProp: string, ...queries): Map<string, Data[]> {
        return storage.findGroupedBy(storageData, groupProp, ...queries);
    }

    static createData(dataClass: string, data: Data | Data[]): Promise {
        return storage.createData(dataClass, data);
    }

    static updateData(data: Data | Data[]): Promise {
        return storage.updateData(data);
    }

    static deleteData(data: Data | Data[]): Promise<Data> {
        return storage.deleteData(data);
    }
}

export default LocalStorageService;