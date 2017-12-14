import C from "../../Constants";
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
            if (config.addmonsteronlist === undefined) config.addmonsteronlist = true;
            if (config.addmonsteronhlist === undefined) config.addmonsteronhlist = true;
            if (config.addmonsterondetail === undefined) config.addmonsterondetail = true;
            if (config.tableroll === undefined) config.tableroll = true;
            if (config.charfavicon === undefined) config.charfavicon = true;
            if (config.mycharacterfolders === undefined) config.mycharacterfolders = true;
            if (config.campaigncharacterfolders === undefined) config.campaigncharacterfolders = true;
            return Promise.resolve(config);
        });
    }
}

export default ConfigStorageService;