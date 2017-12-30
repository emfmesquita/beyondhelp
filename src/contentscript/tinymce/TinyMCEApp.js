import 'react-select/dist/react-select.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import './TinyMCEApp.scss';

import { Alert, Button, ButtonToolbar, ControlLabel, FormGroup, Nav, NavItem } from 'react-bootstrap';
import React, { Component } from 'react';

import C from "../../Constants";
import DDBSearchService from "../../services/DDBSearchService";
import HomebrewEntry from "../../data/HomebrewEntry";
import MessageService from "../../services/MessageService";
import ReactDOM from 'react-dom';
import SearchField from "./SearchField";
import Select from 'react-select';
import SelectField from "./SelectField";
import TooltipOptions from "./TooltipOptions";
import Type from "./TooltipType";
import debounce from "debounce-promise";

/* global chrome */

const tooltipsTabId = "tooltips";

const baseGetOptionsSearcher = function (ddbSearcher: Function, isHomebrew: boolean, pageSize = 20) {
    return debounce((input) => {
        return ddbSearcher(input).then(results => {
            results = results || [];
            return {
                options: results.map(r => {
                    let label = null;
                    if (!isHomebrew) {
                        label = r;
                    } else {
                        const autorSufix = r.author ? " - " + r.author : "";
                        const versionSufix = r.version ? " - v" + r.version : "";
                        label = r.name + autorSufix + versionSufix;
                    }
                    return { label, value: r };
                }),
                complete: results.length < pageSize
            };
        }).catch(() => { return { options: [] }; });
    }, 500);
};

const baseGetOptions = function (searcher: Function) {
    return (input) => {
        if (!input) return Promise.resolve({ options: [] });
        return searcher(input);
    };
};

const baseOptionSelected = function (type: string, app: TinyMCEApp) {
    return (selected) => {
        if (!selected) {
            app.setState({ toAddContent: null });
            return;
        }

        let toAddContent = null;
        if (!Type.isHomebrew(type)) {
            const tag = Type.getTag(type);
            toAddContent = `[${tag}]${selected.value}[/${tag}]`;
        } else {
            const entry: HomebrewEntry = selected.value;
            const clazz = Type.getHomebrewClassName(type);

            const [, action, slug] = entry.path.split("/");
            const [id] = slug.split("-");
            const tooltipPath = `/${action}/${id}-tooltip`;

            toAddContent = `<a class="${clazz} bh-tooltip tooltip-hover" href="https://www.dndbeyond.com${entry.path}" data-tooltip-href="https://www.dndbeyond.com${tooltipPath}">${entry.name}</a>`;
        }
        app.setState({ toAddContent });
    };
};

const searchers = {
    [Type.Equipment]: baseGetOptionsSearcher(DDBSearchService.equipment, false, 30),
    [Type.MagicItem]: baseGetOptionsSearcher(DDBSearchService.magicItems),
    [Type.Monster]: baseGetOptionsSearcher(DDBSearchService.monsters),
    [Type.Spell]: baseGetOptionsSearcher(DDBSearchService.spells),
    [Type.HomebrewMagicItem]: baseGetOptionsSearcher(DDBSearchService.homebrewMagicItems, true),
    [Type.HomebrewMonster]: baseGetOptionsSearcher(DDBSearchService.homebrewMonsters, true),
    [Type.HomebrewSpell]: baseGetOptionsSearcher(DDBSearchService.homebrewSpells, true),
    [Type.HomebrewCollectionMagicItem]: baseGetOptionsSearcher(DDBSearchService.homebrewCollectionMagicItems, true),
    [Type.HomebrewCollectionMonster]: baseGetOptionsSearcher(DDBSearchService.homebrewCollectionMonsters, true),
    [Type.HomebrewCollectionSpell]: baseGetOptionsSearcher(DDBSearchService.homebrewCollectionSpells, true)
};

class TinyMCEApp extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeTab: tooltipsTabId,
            toAddContent: null,
            tooltipType: null
        };

        this.tooltipSelect = null;

        this.options = {};
        const addOptions = (type) => this.options[type] = TooltipOptions.getOptions(type);
        const addGetOptions = (type, searcher) => this.options[type] = baseGetOptions(searcher);
        Type.allTypes().forEach(type => Type.isSearchable(type) ? addGetOptions(type, searchers[type]) : addOptions(type));

        this.tooltipSelected = {};
        Type.allTypes().forEach(type => this.tooltipSelected[type] = baseOptionSelected(type, this));

        this.placeHolders = {
            [Type.Action]: "Choose an Action",
            [Type.Condition]: "Choose a Condition",
            [Type.Equipment]: "Names, Types, Attributes, Tags, or Notes",
            [Type.MagicItem]: "Search Item Names",
            [Type.Monster]: "Search Monster Names",
            [Type.Sense]: "Choose a Sense",
            [Type.Skill]: "Choose a Skill",
            [Type.Spell]: "Search Spell Names",
            [Type.WeaponProperty]: "Choose a Weapon Property",
            [Type.HomebrewCollectionMagicItem]: "Search Item Names",
            [Type.HomebrewCollectionMonster]: "Search Monster Names",
            [Type.HomebrewCollectionSpell]: "Search Spell Names",
            [Type.HomebrewMagicItem]: "Search Item Names",
            [Type.HomebrewMonster]: "Search Monster Names",
            [Type.HomebrewSpell]: "Search Spell Names"
        };
    }

    componentDidMount() {
        if (this.tooltipSelect) this.tooltipSelect.focus();
    }

    isAddDisabled = () => {
        return !this.state.tooltipType || !this.state.toAddContent;
    }

    addAndClose = () => {
        chrome.tabs.getCurrent(tab => {
            MessageService.sendToTab(tab.id, C.AddContentToTinyMessage, { content: this.state.toAddContent });
            MessageService.sendToTab(tab.id, C.CloseTinyMessage);
        });
    }

    add = () => {
        chrome.tabs.getCurrent(tab => MessageService.sendToTab(tab.id, C.AddContentToTinyMessage, { content: this.state.toAddContent }));
    }

    close = () => {
        chrome.tabs.getCurrent(tab => MessageService.sendToTab(tab.id, C.CloseTinyMessage));
    }

    tooltipTypeSelected = (value) => {
        this.setState({ tooltipType: value, toAddContent: null });
    }

    renderAlerts = () => {
        if (!this.state.tooltipType) return null;
        const type = this.state.tooltipType.value;
        return (
            <div>
                {Type.isHomebrew(type) && <Alert bsStyle="warning">Homebrew tooltips may cease to work if the implementation of tooltips changes on DDB.</Alert>}
                {Type.isHomebrewCollection(type) && <Alert bsStyle="danger">Private homebrews are only viewable by the author. Use them in private only.</Alert>}
            </div>
        );
    }

    renderTooltips = () => {
        if (!this.state.tooltipType) return null;
        const type = this.state.tooltipType.value;
        if (Type.isSearchable(type)) {
            return <SearchField key={type} loadOptions={this.options[type]} onChange={this.tooltipSelected[type]} placeholder={this.placeHolders[type]} />;
        }
        return <SelectField key={type} options={this.options[type]} onChange={this.tooltipSelected[type]} placeholder={this.placeHolders[type]} />;
    }

    render() {
        return (
            <div className="bh-tinymce-dialog">
                <Nav bsStyle="tabs" activeKey={this.state.activeTab} onSelect={(activeTab) => this.setState({ activeTab })}>
                    <NavItem eventKey={tooltipsTabId} title="Tooltips">Tooltips</NavItem>
                </Nav>
                <form className="bh-content-panel">
                    <FormGroup>
                        <ControlLabel>Type</ControlLabel>
                        <Select
                            onChange={this.tooltipTypeSelected}
                            options={[
                                { label: "Action", value: Type.Action },
                                { label: "Condition", value: Type.Condition },
                                { label: "Equipment", value: Type.Equipment },
                                { label: "Magic Item", value: Type.MagicItem },
                                { label: "Monster", value: Type.Monster },
                                { label: "Sense", value: Type.Sense },
                                { label: "Skill", value: Type.Skill },
                                { label: "Spell", value: Type.Spell },
                                { label: "Weapon Property", value: Type.WeaponProperty },
                                { label: "Homebrew Collection Magic Item (Beta)", value: Type.HomebrewCollectionMagicItem },
                                { label: "Homebrew Collection Monster (Beta)", value: Type.HomebrewCollectionMonster },
                                { label: "Homebrew Collection Spell (Beta)", value: Type.HomebrewCollectionSpell },
                                { label: "Homebrew Magic Item (Beta)", value: Type.HomebrewMagicItem },
                                { label: "Homebrew Monster (Beta)", value: Type.HomebrewMonster },
                                { label: "Homebrew Spell (Beta)", value: Type.HomebrewSpell }
                            ]}
                            value={this.state.tooltipType}
                            placeholder="Select Tooltip Type"
                            ref={(el) => this.tooltipSelect = el}
                        />
                    </FormGroup>
                    {this.renderTooltips()}
                    {this.renderAlerts()}
                </form>

                <ButtonToolbar className="bh-button-toolbar">
                    <Button bsStyle="primary" disabled={this.isAddDisabled()} onClick={this.addAndClose}>
                        Add and Close
                    </Button>
                    <Button disabled={this.isAddDisabled()} onClick={this.add}>
                        Add
                    </Button>
                    <Button onClick={this.close}>
                        Close
                    </Button>
                </ButtonToolbar>
            </div>
        );
    }
}

export default TinyMCEApp;