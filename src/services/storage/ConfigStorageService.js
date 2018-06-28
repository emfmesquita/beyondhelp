import C from "../../Constants";
import Configuration from "../../data/Configuration";
import FormMapRefsData from "../../data/FormMapRefsData";
import LocalStorageService from "./LocalStorageService";
import Opt from "../../Options";
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

    /**
     * Gets or creates the data from extra map refs of options page.
     */
    static getFormMapRefs(): Promise<FormMapRefsData> {
        return LocalStorageService.getData(C.FormMapRefsId).then((formMapRefs: FormMapRefsData) => {
            if (!formMapRefs) return LocalStorageService.createData(null, new FormMapRefsData(""));
            return Promise.resolve(formMapRefs);
        });
    }

    /**
     * Updates the data from extra map refs of options page.
     * @param {*} content 
     */
    static saveFormMapRefs(content: string): Promise<FormMapRefsData> {
        return ConfigStorageService.getFormMapRefs().then((formMapRefs: FormMapRefsData) => {
            formMapRefs.content = content;
            return LocalStorageService.updateData(formMapRefs);
        });
    }
}

export default ConfigStorageService;