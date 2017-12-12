import Prefix from "./Prefix";

/**
 * Class with querybuilder to use on finds.
 */
class Q {
    static clazz(dataClass: string) {
        return (data: Data) => data.storageId && data.storageId.startsWith(Prefix.getStoragePrefix(dataClass));
    }

    static eq(propName: string, propValue: any) {
        return (data: Data) => data[propName] === propValue;
    }

    static in(propName: string, array: any[]) {
        return (data: Data) => array.indexOf(data[propName]) > -1;
    }
}

export default Q;