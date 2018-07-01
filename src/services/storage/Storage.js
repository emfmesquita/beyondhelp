import C from "../../Constants";
import Data from "../../data/Data";
import MessageService from "../MessageService";
import MonsterData from '../../data/MonsterData';
import MonsterListData from '../../data/MonsterListData';
import Prefix from "./Prefix";
import type StorageData from "../../data/StorageData";

/* global chrome */

const getStorageData = function (id: string, storage): Promise<StorageData> {
    return new Promise((resolve, reject) => {
        storage.get(id ? id : null, (storageData: StorageData) => {
            chrome.runtime.lastError ? reject(chrome.runtime.lastError) : resolve(storageData);
        });
    });
};

const getData = function (id: string, storage): Promise<Data> {
    return getStorageData(id, storage).then(storageData => storageData[id]);
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

const createData = function (dataClass: string, data: Data | Data[], storage): Promise {
    return new Promise((resolve, reject) => {
        const storageEntry: StorageData = {};
        if (Array.isArray(data)) {
            data.forEach((dataEntry, idx) => {
                prepareData(dataEntry, () => Prefix.createStorageId(dataClass, idx), storageEntry);
            });
        } else {
            prepareData(data, () => Prefix.createStorageId(dataClass), storageEntry);
        }

        storage.set(storageEntry, () => {
            chrome.runtime.lastError ? reject(chrome.runtime.lastError) : resolve(data);
            MessageService.send(C.ReloadMessage);
        });
    });
};

const updateData = function (data: Data | Data[], storage): Promise {
    return createData(null, data, storage);
};

const deleteData = function (data: Data | Data[], storage): Promise<Data> {
    return new Promise((resolve, reject) => {
        const toDelete = Array.isArray(data) ? data.map((d) => d.storageId) : data.storageId;
        storage.remove(toDelete, (error) => {
            chrome.runtime.lastError ? reject(chrome.runtime.lastError) : resolve();
            MessageService.send(C.ReloadMessage);
        });
    });
};

class Storage {

    constructor(storage) {
        this.storage = storage;
    }

    getData(id: string): Promise<Data> {
        return getData(id, this.storage);
    }

    /**
     * @param {string} id If null get all entries.
     */
    getStorageData(id: string): Promise<StorageData> {
        return getStorageData(id, this.storage);
    }

    findSingle(storageData: StorageData, ...queries): Data {
        return findSingle(storageData, ...queries);
    }

    find(storageData: StorageData, ...queries): Data[] {
        return find(storageData, ...queries);
    }

    findGroupedBy(storageData: StorageData, groupProp: string, ...queries): Map<string, Data[]> {
        return findGroupedBy(storageData, groupProp, ...queries);
    }

    createData(dataClass: string, data: Data | Data[]): Promise {
        return createData(dataClass, data, this.storage);
    }

    updateData(data: Data | Data[]): Promise {
        return updateData(data, this.storage);
    }

    deleteData(data: Data | Data[]): Promise<Data> {
        return deleteData(data, this.storage);
    }
}

export default Storage;