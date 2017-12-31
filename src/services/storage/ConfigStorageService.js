import C from "../../Constants";
import Opt from "../../Options";
import Configuration from "../../data/Configuration";
import StorageService from "./StorageService";

class ConfigStorageService {

    /**
     * Gets or creates the configuration data.
     */
    static getConfig(): Promise<Configuration> {
        return StorageService.getData(C.ConfigurationId).then((config: Configuration) => {
            if (!config) return StorageService.createData("Configuration", new Configuration());

            // fallback to created props
            Opt.AllOptions.forEach(opt => {
                if (config[opt] === undefined) config[opt] = true;
            });

            return Promise.resolve(config);
        });
    }
}

export default ConfigStorageService;