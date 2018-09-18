import C from "../../Constants";
import Configuration from "../../data/Configuration";
import ExtraMapRefsData from "../../data/ExtraMapRefsData";
import LocalStorageService from "./LocalStorageService";
import Opt from "../../Options";
import Q from "../../services/storage/Q";
import type StorageData from "../../data/StorageData";
import SyncStorageService from "./SyncStorageService";

class ConfigStorageService {

    /**
     * Gets or creates the configuration data.
     */
    static getConfig(): Promise<Configuration> {
        return SyncStorageService.getData(C.ConfigurationId).then((config: Configuration) => {
            if (!config) return SyncStorageService.createData("Configuration", new Configuration());

            // fallback to created props
            Opt.AllOptions.forEach(opt => {
                if (config[opt] === undefined) config[opt] = Configuration.initialValue(opt);
            });

            return Promise.resolve(config);
        });
    }
}

export default ConfigStorageService;