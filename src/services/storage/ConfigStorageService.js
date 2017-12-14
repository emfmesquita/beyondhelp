import C from "../../Constants";
import StorageService from "./StorageService";

class ConfigStorageService {

    /**
     * Gets or creates the configuration data.
     */
    static getConfig(): Promise<Configuration> {
        return StorageService.getData(C.ConfigurationId).then(config => {
            return config ? Promise.resolve(config) : StorageService.createData("Configuration", new Configuration());
        });
    };
}

export default ConfigStorageService;