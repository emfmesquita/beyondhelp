import { Form, ListGroup } from 'react-bootstrap';
import React, { Component } from 'react';

import C from "../Constants";
import CheckBoxField from "../forms/CheckBoxField";
import ConfigStorageService from "../services/storage/ConfigStorageService";
import Configuration from "../data/Configuration";
import FieldService from "../services/FieldService";
import MapTooltipForm from "./extramaprefs/ExtraMapRefsOptions";
import Opt from "../Options";
import OptionGroup from "./OptionGroup";
import OptionLine from "../forms/OptionLine";
import PbpEntriesForm from "./playbypost/PbpEntriesForm";
import SyncStorageService from "../services/storage/SyncStorageService";

class OptionsApp extends Component {

    constructor(props) {
        super(props);

        const initState = {};
        Opt.AllOptions.forEach(opt => initState[opt] = false);
        this.state = initState;

        this.init();
    }

    init = () => {
        ConfigStorageService.getConfig().then((config: Configuration) => {
            const newState = {};
            Opt.AllOptions.forEach(opt => newState[opt] = config[opt]);
            this.setState(newState);
        });
    }

    updateConfig = () => {
        ConfigStorageService.getConfig().then((config: Configuration) => {
            Opt.AllOptions.forEach(opt => config[opt] = this.state[opt]);
            return SyncStorageService.updateData(config);
        });
    }

    changeOptionHandler = (prop: string) => {
        const baseChangeFunc = FieldService.onToggleFunc(prop, this);
        return (e) => {
            baseChangeFunc(e);
            this.updateConfig();
        };
    }

    optionField = (label: string, option: string) => {
        return <CheckBoxField className="BH-option-field" checkText={label} value={this.state[option]} onChange={this.changeOptionHandler(option)} />;
    }

    render() {
        return (
            <div>
                <OptionGroup label="Character Folders">
                    {this.optionField("Enable folders and sort on 'My Characters' page.", Opt.MyCharactersFolders)}
                    {this.optionField("Enable folders and sort on campaign pages.", Opt.CampaignCharactersFolders)}
                </OptionGroup>
                <OptionGroup label="Editor">
                    {this.optionField("Enable Beyond Help button on editors.", Opt.EditorButton)}
                    {this.optionField("Enable Tooltips Tab on Beyond Help Editor Dialog.", Opt.TooltipsTab)}
                    {this.optionField("Enable Rollable Tables Tab on Beyond Help Editor Dialog.", Opt.TablesTab)}
                    {this.optionField("Enable Fullscreen button on editors.", Opt.FullscreenButton)}
                </OptionGroup>
                <OptionGroup label="Favicons">
                    {this.optionField("Change character pages favicon.", Opt.CharacterFavIcon)}
                </OptionGroup>
                <OptionGroup label="Map References">
                    {this.optionField("Global enable map references.", Opt.MapRefs)}
                    {this.optionField("Enable main map references (rectangular references).", Opt.MapRefsRect)}
                    {this.optionField("Enable map to map references (circle references).", Opt.MapRefsCirc)}
                    {this.optionField("Enable extra map references (diamond shape references).", Opt.MapRefsRho)}
                    {this.optionField("Enable links to maps on compendium headers.", Opt.MapLinks)}
                    {this.optionField("Enable links to maps on compendium menus.", Opt.MapMenuLinks)}
                    {this.optionField("Enable links to maps on compendium table of contents.", Opt.MapTocLinks)}
                </OptionGroup>
                {/* <OptionGroup label="Extra Map References">
                    {this.optionField("Enable extra map references mode (with visual helpers on compendium pages).", Opt.ExtraMapRefsMode)}
                    <MapTooltipForm />
                </OptionGroup> */}
                <OptionGroup label="Monster Buttons">
                    {this.optionField("Show buttons to add monsters on monsters listing pages.", Opt.AddMonsterOnList)}
                    {this.optionField("Show buttons to add monsters on monsters details pages.", Opt.AddMonsterOnDetail)}
                    {this.optionField("Show buttons to add monsters on homebrew pages.", Opt.AddMonsterOnHomebrewList)}
                </OptionGroup>
                <OptionGroup label="Tooltips">
                    {this.optionField("Enable Homebrew Tooltips (options on editor, style and error handling).", Opt.HomebrewTooltips)}
                    {this.optionField("Enable Extra Tooltips (backgrounds and feats).", Opt.CustomTooltips)}
                    {this.optionField("Enable Reference Tooltips.", Opt.RefTooltips)}
                    {this.optionField("Add tooltips to main map references (rectangular ones) .", Opt.MapRefsRectTooltips)}
                    {this.optionField("Add tooltips to map to map references (circle ones).", Opt.MapRefsCircTooltips)}
                    {this.optionField("Add tooltips to extra map references (diamond shape ones).", Opt.MapRefsRhoTooltips)}
                    {this.optionField("Add tooltips to links on compendium headers.", Opt.MapLinksTooltips)}
                    {this.optionField("Add tooltips to links on compendium menus.", Opt.MapMenuLinksTooltips)}
                    {this.optionField("Add tooltips to links compendium table of contents.", Opt.MapTocLinksTooltips)}
                </OptionGroup>
                <OptionGroup label="Play by Post">
                    {this.optionField("Enable Campaign Notes on PbP pages.", Opt.PbpNotes)}
                    <PbpEntriesForm />
                </OptionGroup>
                {this.optionField("Add buttons to copy references on compendium pages.", Opt.RefButtons)}
                {this.optionField("Enable roll on tables.", Opt.TableRolls)}
                <textarea className="BH-option-form-width-hack" />
            </div>
        );
    }
}

export default OptionsApp;