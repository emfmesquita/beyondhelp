const defaultMonsterColor = "#d9534f";
const presetMonsterColor = [defaultMonsterColor, '#F5A623', '#F8E71C', '#7ED321', '#B8E986', '#50E3C2', '#4A90E2', '#D234EF'];
const defaultMonsterTextColor = "#333";
const presetMonsterTextColor = [defaultMonsterTextColor];
const defaultListHeaderColor = "#333";
const presetListHeaderColor = [defaultListHeaderColor];

const ddbColors = Object.freeze({
    gray: "#979aa4",
    orange: "#ee8600",
    red: "#bc0f0f",
    green: "#47D18C",
    darkBlue: "#0f5cbc"
});

const configurationId = "bh-config";
const pbpRefsId = "pbp-thread";

const compendiumPage = "https://www.dndbeyond.com/compendium/";

const mapAreaRect = "rect";
const mapAreaCircle = "circle";
const mapAreaRhombus = "rhombus";

const addMonsterMessage = "addmonstermessage";
const closeTinyMessage = "closetinymessage";
const addContentToTinyMessage = "addcontenttotinymessage";
const getSelectedTableTinyMessage = "selectedtablemessage";
const updateSelectedTableTinyMessage = "updateselectedtablemessage";
const reloadMessage = "reloadmessage";
const rowLoadedMessage = "rowloadedmessage";
const usernameMessage = "usernamemessage";
const tooltipErrorMessage = "tooltiperrormessage";
const commentChangedMessage = "commentchangedmessage";
const buildTooltipMessage = "buildtooltipmessage";

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

    static get DDBColors() {
        return ddbColors;
    }

    static get ConfigurationId() {
        return configurationId;
    }

    static get PbpRefsId() {
        return pbpRefsId;
    }

    static get CompendiumPage() {
        return compendiumPage;
    }

    static get MapAreaRect() {
        return mapAreaRect;
    }
    static get MapAreaCircle() {
        return mapAreaCircle;
    }
    static get MapAreaRhombus() {
        return mapAreaRhombus;
    }

    static get AddMonsterMessage() {
        return addMonsterMessage;
    }
    static get CloseTinyMessage() {
        return closeTinyMessage;
    }
    static get AddContentToTinyMessage() {
        return addContentToTinyMessage;
    }
    static get GetSelectedTableTinyMessage() {
        return getSelectedTableTinyMessage;
    }
    static get UpdateSelectedTableTinyMessage() {
        return updateSelectedTableTinyMessage;
    }
    static get ReloadMessage() {
        return reloadMessage;
    }
    static get RowLoadedMessage() {
        return rowLoadedMessage;
    }
    static get UsernameMessage() {
        return usernameMessage;
    }
    static get TooltipErrorMessage() {
        return tooltipErrorMessage;
    }
    static get CommentChangedMessage() {
        return commentChangedMessage;
    }
    static get BuildTooltipMessage() {
        return buildTooltipMessage;
    }
}

export default Constants;