import { Form, ListGroup, Row, Col, Tab, Nav, NavItem } from 'react-bootstrap';
import React, { Component } from 'react';

import C from "../Constants";
import CheckBoxField from "../forms/CheckBoxField";
import ConfigStorageService from "../services/storage/ConfigStorageService";
import Configuration from "../data/Configuration";
import ExtraMapRefsOptions from "./extramaprefs/ExtraMapRefsOptions";
import FieldService from "../services/FieldService";
import MessageService from '../services/MessageService';
import Opt from "../Options";
import OptionGroup from "./OptionGroup";
import OptionLine from "../forms/OptionLine";
import OptionsCredits from './OptionsCredits';
import OptionsDonations from './OptionsDonations';
import PbpEntriesForm from "./playbypost/PbpEntriesForm";
import SyncStorageService from "../services/storage/SyncStorageService";

let initialized = false;

class OptionsApp extends Component {

    constructor(props) {
        super(props);

        const initState = {};
        Opt.AllOptions.forEach(opt => initState[opt] = Configuration.initialValue(opt));
        this.state = initState;

        this.init();
    }

    init = () => {
        ConfigStorageService.getConfig().then((config: Configuration) => {
            const newState = {};
            Opt.AllOptions.forEach(opt => newState[opt] = config[opt]);
            initialized = true;
            this.setState(newState);
        });
    }

    updateConfig = () => {
        return ConfigStorageService.getConfig().then((config: Configuration) => {
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

    handleBundleDrawingChange = (bundleId: string) => {
        this.setState({ [Opt.ExtraMapRefsDrawingBundle]: bundleId }, () => {
            this.updateConfig().then(() => MessageService.send(C.ExtraMapRefsChangesMessage));
        });
    }

    renderExtraMapRefsOptions = () => {
        if (!initialized) return null;
        return <ExtraMapRefsOptions config={this.state} onDrawingBundleChange={this.handleBundleDrawingChange} />;
    }

    renderTabTitles = () => {
        return (
            <Nav bsStyle="pills" stacked>
                <NavItem eventKey="cfolders">Character Folders</NavItem>
                <NavItem eventKey="editor">Editor</NavItem>
                <NavItem eventKey="favicon">Favicons</NavItem>
                <NavItem eventKey="globalmaprefs">Map References (Global)</NavItem>
                <NavItem eventKey="defaultmaprefs">Map References (Default)</NavItem>
                <NavItem eventKey="custommaprefs">Map References (Custom)</NavItem>
                <NavItem eventKey="monsters">Monsters</NavItem>
                <NavItem eventKey="pbp">Play by Post</NavItem>
                <NavItem eventKey="refs">References</NavItem>
                <NavItem eventKey="tooltips">Tooltips</NavItem>
                <NavItem eventKey="toc">Table of Contents</NavItem>
                <NavItem eventKey="tablerolls">Table Rolls</NavItem>
                <NavItem eventKey="credits">Credits</NavItem>
                <NavItem eventKey="donations">Donations</NavItem>
            </Nav>
        );
    }

    renderTabContents = () => {
        return (
            <Tab.Content animation>
                <Tab.Pane eventKey="cfolders">
                    {this.optionField("Enable folders on 'My Characters' page.", Opt.MyCharactersFolders)}
                    {this.optionField("Sort characters alphabetically on 'My Characters' page.", Opt.MyCharacterSort)}
                    {this.optionField("Enable folders on campaign pages.", Opt.CampaignCharactersFolders)}
                </Tab.Pane>
                <Tab.Pane eventKey="editor">
                    {this.optionField("Enable Beyond Help button on editors.", Opt.EditorButton)}
                    {this.optionField("Enable Tooltips Tab on Beyond Help Editor Dialog.", Opt.TooltipsTab)}
                    {this.optionField("Enable Rollable Tables Tab on Beyond Help Editor Dialog.", Opt.TablesTab)}
                    {this.optionField("Enable Fullscreen button on editors.", Opt.FullscreenButton)}
                </Tab.Pane>
                <Tab.Pane eventKey="favicon">
                    {this.optionField("Change character pages favicon.", Opt.CharacterFavIcon)}
                </Tab.Pane>
                <Tab.Pane eventKey="globalmaprefs">
                    {this.optionField("Global enable map references.", Opt.MapRefs)}
                    {this.optionField("Enable main map references (rectangular references).", Opt.MapRefsRect)}
                    {this.optionField("Enable extra map references (diamond shape references).", Opt.MapRefsRho)}
                    {this.optionField("Enable map to map references (circle references).", Opt.MapRefsCirc)}
                    {this.optionField("Enable comment map references.", Opt.MapRefsComments)}
                    {this.optionField("Enable links to maps on compendium headers.", Opt.MapLinks)}
                    {this.optionField("Enable links to maps on compendium menus.", Opt.MapMenuLinks)}
                    {this.optionField("Enable links to maps on compendium table of contents.", Opt.MapTocLinks)}
                </Tab.Pane>
                <Tab.Pane eventKey="defaultmaprefs">
                    {this.optionField("Show default map references from: Lost Mine of Phandelver.", Opt.BhMapRefsLMoP)}
                    {this.optionField("Show default map references from: Hoard of the Dragon Queen.", Opt.BhMapRefsHotDQ)}
                    {this.optionField("Show default map references from: Rise of Tiamat.", Opt.BhMapRefsRoT)}
                    {this.optionField("Show default map references from: Princes of the Apocalypse.", Opt.BhMapRefsPotA)}
                    {this.optionField("Show default map references from: Out of the Abyss.", Opt.BhMapRefsOotA)}
                    {this.optionField("Show default map references from: Tales from the Yawning Portal.", Opt.BhMapRefsTftYP)}
                    {this.optionField("Show default map references from: Tomb of Annihilation.", Opt.BhMapRefsToA)}
                </Tab.Pane>
                <Tab.Pane eventKey="custommaprefs">
                    {this.renderExtraMapRefsOptions()}
                </Tab.Pane>
                <Tab.Pane eventKey="monsters">
                    {this.optionField("Show buttons to add monsters on monsters listing pages.", Opt.AddMonsterOnList)}
                    {this.optionField("Show buttons to add monsters on monsters details pages.", Opt.AddMonsterOnDetail)}
                    {this.optionField("Show buttons to add monsters on homebrew pages.", Opt.AddMonsterOnHomebrewList)}
                    {this.optionField("Add a challenge rate indicator to monsters stat blocks.", Opt.MonsterCRIndicator)}
                    {this.optionField("Notify after a monster is added.", Opt.AddMonsterNotification)}
                </Tab.Pane>
                <Tab.Pane eventKey="pbp">
                    {this.optionField("Enable Campaign Notes on PbP pages.", Opt.PbpNotes)}
                    <PbpEntriesForm />
                </Tab.Pane>
                <Tab.Pane eventKey="refs">
                    {this.optionField("Add buttons to copy references on compendium pages.", Opt.RefButtons)}
                </Tab.Pane>
                <Tab.Pane eventKey="tooltips">
                    {this.optionField("Enable Homebrew Tooltips (options on editor, style and error handling).", Opt.HomebrewTooltips)}
                    {this.optionField("Enable Extra Tooltips (backgrounds and feats).", Opt.CustomTooltips)}
                    {this.optionField("Enable Reference Tooltips.", Opt.RefTooltips)}
                    {this.optionField("Add tooltips to main map references (rectangular ones) .", Opt.MapRefsRectTooltips)}
                    {this.optionField("Add tooltips to map to map references (circle ones).", Opt.MapRefsCircTooltips)}
                    {this.optionField("Add tooltips to extra map references (diamond shape ones).", Opt.MapRefsRhoTooltips)}
                    {this.optionField("Add tooltips to links on compendium headers.", Opt.MapLinksTooltips)}
                    {this.optionField("Add tooltips to links on compendium menus.", Opt.MapMenuLinksTooltips)}
                    {this.optionField("Add tooltips to links compendium table of contents.", Opt.MapTocLinksTooltips)}
                </Tab.Pane>
                <Tab.Pane eventKey="toc">
                    {this.optionField("Show table of contents on compendium pages.", Opt.ToC)}
                </Tab.Pane>
                <Tab.Pane eventKey="tablerolls">
                    {this.optionField("Enable roll on tables.", Opt.TableRolls)}
                </Tab.Pane>
                <Tab.Pane eventKey="credits">
                    {<OptionsCredits />}
                </Tab.Pane>
                <Tab.Pane eventKey="donations">
                    {<OptionsDonations />}
                </Tab.Pane>
            </Tab.Content>
        );
    }

    render() {
        if (!initialized) return null;
        const startTab = this.state[Opt.ExtraMapRefsDrawingBundle] ? "custommaprefs" : "cfolders";
        return (
            <div>
                <Tab.Container id="bh-options-tabs" defaultActiveKey={startTab}>
                    <Row className="clearfix">
                        <Col xs={3} className="BH-option-tab-titles-col">
                            {this.renderTabTitles()}
                        </Col>
                        <Col xs={9} className="BH-option-tabs-content-col">
                            <h1>
                                <span className="BH-option-logo" />
                                Beyond Help Options Page
                            </h1>
                            {this.renderTabContents()}
                        </Col>
                    </Row>
                </Tab.Container>
            </div >
        );
    }
}

export default OptionsApp;