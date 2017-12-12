const defaultMonsterColor = "#d9534f";
const presetMonsterColor = [defaultMonsterColor, '#F5A623', '#F8E71C', '#7ED321', '#B8E986', '#50E3C2', '#4A90E2', '#D234EF'];
const defaultMonsterTextColor = "#333";
const presetMonsterTextColor = [defaultMonsterTextColor];
const defaultListHeaderColor = "#333";
const presetListHeaderColor = [defaultListHeaderColor];

const configurationId = "bh-config";

class Constants {
    static get DefaultMonsterColor() {
        return defaultMonsterColor;
    }
    static get PresetMonsterColor() {
        return presetMonsterColor;
    }
    static get DefaultMonsterTextColor() {
        return defaultMonsterTextColor;
    }
    static get PresetMonsterTextColor() {
        return presetMonsterTextColor;
    }
    static get DefaultListHeaderColor() {
        return defaultListHeaderColor;
    }
    static get PresetListHeaderColor() {
        return presetListHeaderColor;
    }

    static get ConfigurationId() {
        return configurationId;
    }
}

export default Constants;