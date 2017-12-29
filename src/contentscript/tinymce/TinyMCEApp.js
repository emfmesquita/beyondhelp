import 'react-select/dist/react-select.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import './TinyMCEApp.scss';

import { Button, ButtonToolbar, ControlLabel, FormGroup, Nav, NavItem } from 'react-bootstrap';
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
import TooltipType from "./TooltipType";
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
                        label = r.name + (r.author ? " - " + r.author : "");
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
        if (!TooltipType.isHomebrew(type)) {
            const tag = TooltipType.getTag(type);
            toAddContent = `[${tag}]${selected.value}[/${tag}]`;
        } else {
            const entry: HomebrewEntry = selected.value;
            const clazz = TooltipType.getHomebrewClassName(type);

            const [, action, compositeId] = entry.path.split("/");
            const [id] = compositeId.split("-");
            const tooltipPath = `/${action}/${id}-tooltip`;

            toAddContent = `<a class="${clazz} bh-tooltip tooltip-hover" href="https://www.dndbeyond.com${entry.path}" data-tooltip-href="https://www.dndbeyond.com${tooltipPath}">${entry.name}</a>`;
        }
        app.setState({ toAddContent });
    };
};

const equipSearcher = baseGetOptionsSearcher(DDBSearchService.equipment, false, 30);
const magicItemSearcher = baseGetOptionsSearcher(DDBSearchService.magicItems);
const monsterSearcher = baseGetOptionsSearcher(DDBSearchService.monsters);
const spellSearcher = baseGetOptionsSearcher(DDBSearchService.spells);
const hMonsterSearcher = baseGetOptionsSearcher(DDBSearchService.homebrewMonsters, true);
const hMagicItemSearcher = baseGetOptionsSearcher(DDBSearchService.homebrewMagicItems, true);
const hSpellSearcher = baseGetOptionsSearcher(DDBSearchService.homebrewSpells, true);

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
        addOptions(TooltipType.Action);
        addOptions(TooltipType.Condition);
        addGetOptions(TooltipType.Equipment, equipSearcher);
        addGetOptions(TooltipType.MagicItem, magicItemSearcher);
        addGetOptions(TooltipType.Monster, monsterSearcher);
        addOptions(TooltipType.Sense);
        addOptions(TooltipType.Skill);
        addGetOptions(TooltipType.Spell, spellSearcher);
        addOptions(TooltipType.WeaponProperty);
        addGetOptions(TooltipType.HomebrewMonster, hMonsterSearcher);
        addGetOptions(TooltipType.HomebrewMagicItem, hMagicItemSearcher);
        addGetOptions(TooltipType.HomebrewSpell, hSpellSearcher);

        this.tooltipSelected = {};
        const addHandler = (type) => this.tooltipSelected[type] = baseOptionSelected(type, this);
        addHandler(TooltipType.Action);
        addHandler(TooltipType.Condition);
        addHandler(TooltipType.Equipment);
        addHandler(TooltipType.MagicItem);
        addHandler(TooltipType.Monster);
        addHandler(TooltipType.Sense);
        addHandler(TooltipType.Skill);
        addHandler(TooltipType.Spell);
        addHandler(TooltipType.WeaponProperty);
        addHandler(TooltipType.HomebrewMonster);
        addHandler(TooltipType.HomebrewMagicItem);
        addHandler(TooltipType.HomebrewSpell);
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

    renderTooltips = () => {
        if (!this.state.tooltipType) return null;
        const type = this.state.tooltipType.value;
        switch (type) {
            case TooltipType.Action:
                return <SelectField options={this.options[type]} onChange={this.tooltipSelected[type]} placeholder="Choose an Action" />;
            case TooltipType.Condition:
                return <SelectField options={this.options[type]} onChange={this.tooltipSelected[type]} placeholder="Choose a Condition" />;
            case TooltipType.Equipment:
                return <SearchField loadOptions={this.options[type]} onChange={this.tooltipSelected[type]} placeholder="Names, Types, Attributes, Tags, or Notes" />;
            case TooltipType.MagicItem:
                return <SearchField loadOptions={this.options[type]} onChange={this.tooltipSelected[type]} placeholder="Search Item Names" />;
            case TooltipType.Monster:
                return <SearchField loadOptions={this.options[type]} onChange={this.tooltipSelected[type]} placeholder="Search Monster Names" />;
            case TooltipType.Sense:
                return <SelectField options={this.options[type]} onChange={this.tooltipSelected[type]} placeholder="Choose a Sense" />;
            case TooltipType.Skill:
                return <SelectField options={this.options[type]} onChange={this.tooltipSelected[type]} placeholder="Choose a Skill" />;
            case TooltipType.Spell:
                return <SearchField loadOptions={this.options[type]} onChange={this.tooltipSelected[type]} placeholder="Search Spell Names" />;
            case TooltipType.WeaponProperty:
                return <SelectField options={this.options[type]} onChange={this.tooltipSelected[type]} placeholder="Choose a Weapon Property" />;
            case TooltipType.HomebrewMonster:
                return <SearchField loadOptions={this.options[type]} onChange={this.tooltipSelected[type]} placeholder="Search Monster Names" />;
            case TooltipType.HomebrewMagicItem:
                return <SearchField loadOptions={this.options[type]} onChange={this.tooltipSelected[type]} placeholder="Search Item Names" />;
            case TooltipType.HomebrewSpell:
                return <SearchField loadOptions={this.options[type]} onChange={this.tooltipSelected[type]} placeholder="Search Spell Names" />;
            default:
                return null;
        }
    }

    renderTooltipSelector = () => {
        if (this.state.activeTab === tooltipsTabId) return this.renderTooltips();
        return null;
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
                                { label: "Action", value: TooltipType.Action },
                                { label: "Condition", value: TooltipType.Condition },
                                { label: "Equipment", value: TooltipType.Equipment },
                                { label: "Magic Item", value: TooltipType.MagicItem },
                                { label: "Monster", value: TooltipType.Monster },
                                { label: "Sense", value: TooltipType.Sense },
                                { label: "Skill", value: TooltipType.Skill },
                                { label: "Spell", value: TooltipType.Spell },
                                { label: "Weapon Property", value: TooltipType.WeaponProperty },
                                { label: "Homebrew Creation", value: TooltipType.HomebrewCreation },
                                { label: "Homebrew Magic Item", value: TooltipType.HomebrewMagicItem },
                                { label: "Homebrew Monster", value: TooltipType.HomebrewMonster },
                                { label: "Homebrew Spell", value: TooltipType.HomebrewSpell }
                            ]}
                            value={this.state.tooltipType}
                            placeholder="Select Tooltip Type"
                            ref={(el) => this.tooltipSelect = el}
                        />
                    </FormGroup>
                    {this.renderTooltipSelector()}
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