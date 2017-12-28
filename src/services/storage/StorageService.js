import Configuration from '../../data/Configuration';
import C from "../../Constants";
import Data from "../../data/Data";
import MessageService from "../MessageService";
import MonsterData from '../../data/MonsterData';
import MonsterListData from '../../data/MonsterListData';
import Prefix from "./Prefix";

/* global chrome */

type StorageData = { [key: string]: Data }

const getStorageData = function (id: string): Promise<StorageData> {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(id ? id : null, (storageData: StorageData) => {
            chrome.runtime.lastError ? reject(chrome.runtime.lastError) : resolve(storageData);
        });
    });
};

const getData = function (id: string): Promise<Data> {
    return getStorageData(id).then(storageData => storageData[id]);
};

const innerFind = function (data: Data, queries): boolean {
    return !queries || queries.every((query) => query(data));
};

const findSingle = function (storageData: StorageData, ...queries): Data {
    const storageId = Object.keys(storageData).find(storageId => innerFind(storageData[storageId], queries));
    return storageId ? storageData[storageId] : undefined;
};

const find = function (storageData: StorageData, ...queries): Data[] {
    const found = [];
    Object.keys(storageData).forEach(storageId => {
        const data = storageData[storageId];
        if (innerFind(data, queries)) {
            found.push(data);
        }
    });
    return found;
};

const findGroupedBy = function (storageData: StorageData, groupProp: string, ...queries): Map<string, Data[]> {
    const result = new Map();
    Object.keys(storageData).forEach((storageId) => {
        const data = storageData[storageId];
        if (!innerFind(data, queries)) return;

        const propValue = data[groupProp];
        if (!result.has(propValue)) {
            result.set(propValue, []);
        }
        result.get(propValue).push(data);
    });
    return result;
};

const prepareData = function (data: Data, storageIdHandler: Function, storageEntry) {
    if (!data.storageId) data.storageId = storageIdHandler();
    const clone = JSON.parse(JSON.stringify(data));
    delete clone.lists;
    delete clone.monsters;
    storageEntry[clone.storageId] = clone;
};

const createData = function (dataClass: string, data: Data | Data[]): Promise {
    return new Promise((resolve, reject) => {
        const storageEntry: StorageData = {};
        if (Array.isArray(data)) {
            data.forEach((dataEntry, idx) => {
                prepareData(dataEntry, () => Prefix.createStorageId(dataClass, idx), storageEntry);
            });
        } else {
            prepareData(data, () => Prefix.createStorageId(dataClass), storageEntry);
        }

        chrome.storage.sync.set(storageEntry, () => {
            chrome.runtime.lastError ? reject(chrome.runtime.lastError) : resolve(data);
            MessageService.send(C.ReloadMessage);
        });
    });
};

const updateData = function (data: Data | Data[]): Promise {
    return createData(null, data);
};

const deleteData = function (data: Data | Data[]): Promise<Data> {
    return new Promise((resolve, reject) => {
        const toDelete = Array.isArray(data) ? data.map((d) => d.storageId) : data.storageId;
        chrome.storage.sync.remove(toDelete, (error) => {
            chrome.runtime.lastError ? reject(chrome.runtime.lastError) : resolve();
            MessageService.send(C.ReloadMessage);
        });
    });
};

class StorageService {

    static getData(id: string): Promise<Data> {
        return getData(id);
    }

    /**
     * @param {string} id If null get all entries.
     */
    static getStorageData(id: string): Promise<StorageData> {
        return getStorageData(id);
    }

    static findSingle(storageData: StorageData, ...queries): Data {
        return findSingle(storageData, ...queries);
    }

    static find(storageData: StorageData, ...queries): Data[] {
        return find(storageData, ...queries);
    }

    static findGroupedBy(storageData: StorageData, groupProp: string, ...queries): Map<string, Data[]> {
        return findGroupedBy(storageData, groupProp, ...queries);
    }

    static createData(dataClass: string, data: Data | Data[]): Promise {
        return createData(dataClass, data);
    }

    static updateData(data: Data | Data[]): Promise {
        return updateData(data);
    }

    static deleteData(data: Data | Data[]): Promise<Data> {
        return deleteData(data);
    }
}

export default StorageService;