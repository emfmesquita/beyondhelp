import 'react-select/dist/react-select.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import './TinyMCEApp.scss';

import { Alert, Button, ButtonToolbar, ControlLabel, FormGroup, Nav, NavItem } from 'react-bootstrap';
import React, { Component } from 'react';

import C from "../../Constants";
import DDBSearchService from "../../services/DDBSearchService";
import MessageService from "../../services/MessageService";
import ReactDOM from 'react-dom';
import SearchField from "../../forms/SearchField";
import Select from 'react-select';
import SelectField from "../../forms/SelectField";
import TooltipEntry from "../../data/TooltipEntry";
import TooltipOptions from "../tooltips/TooltipOptions";
import Type from "../tooltips/TooltipType";
import debounce from "debounce-promise";

/* global chrome */

const tooltipsTabId = "tooltips";

/**
 * Builds a debounced option searcher.
 */
const baseGetOptionsSearcher = function (ddbSearcher: Function, isHomebrewOrCustom: boolean, pageSize = 20) {
    return debounce((input) => {
        return ddbSearcher(input).then(results => {
            results = results || [];
            return {
                options: results.map(r => {
                    let label = null;
                    if (!isHomebrewOrCustom) {
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

        // builds the content to add to editor
        // tag if normal and anchor if homebrew or custom
        let toAddContent = "";
        if (Type.isCommon(type)) {
            const tag = Type.getTag(type);
            toAddContent = `[${tag}]${selected.value}[/${tag}]`;
        } else if (Type.isHomebrew(type)) {
            const hEntry: TooltipEntry = selected.value;
            const clazz = Type.getHomebrewClassName(type);

            const [, action, slug] = hEntry.path.split("/");
            const [id] = slug.split("-");
            const tooltipPath = `/${action}/${id}-tooltip`;

            toAddContent = `<a class="${clazz} tooltip-hover" href="https://www.dndbeyond.com${hEntry.path}" data-tooltip-href="https://www.dndbeyond.com${tooltipPath}">${hEntry.name}</a>`;
        } else if (Type.isCustom(type)) {
            const cEntry: TooltipEntry = selected.value;
            toAddContent = `<a class="tooltip-hover" href="https://www.dndbeyond.com${cEntry.path}">${cEntry.name}</a>`;
        }

        app.setState({ toAddContent });
    };
};

const searchers = {
    [Type.Background]: baseGetOptionsSearcher(DDBSearchService.backgrounds, true, Number.MAX_SAFE_INTEGER),
    [Type.Equipment]: baseGetOptionsSearcher(DDBSearchService.equipments, false, 30),
    [Type.Feat]: baseGetOptionsSearcher(DDBSearchService.feats, true, Number.MAX_SAFE_INTEGER),
    [Type.MagicItem]: baseGetOptionsSearcher(DDBSearchService.magicItems),
    [Type.Monster]: baseGetOptionsSearcher(DDBSearchService.monsters),
    [Type.Spell]: baseGetOptionsSearcher(DDBSearchService.spells),
    [Type.HomebrewFeat]: baseGetOptionsSearcher(DDBSearchService.homebrewFeats, true),
    [Type.HomebrewBackground]: baseGetOptionsSearcher(DDBSearchService.homebrewBackgrounds, true),
    [Type.HomebrewMagicItem]: baseGetOptionsSearcher(DDBSearchService.homebrewMagicItems, true),
    [Type.HomebrewMonster]: baseGetOptionsSearcher(DDBSearchService.homebrewMonsters, true),
    [Type.HomebrewSpell]: baseGetOptionsSearcher(DDBSearchService.homebrewSpells, true),
    [Type.HomebrewCollectionBackground]: baseGetOptionsSearcher(DDBSearchService.homebrewCollectionBackgrounds, true),
    [Type.HomebrewCollectionFeat]: baseGetOptionsSearcher(DDBSearchService.homebrewCollectionFeats, true),
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

        // for each type of tooltip builds option list or getOptions function
        this.options = {};
        const addOptions = (type) => this.options[type] = TooltipOptions.getOptions(type);
        const addGetOptions = (type, searcher) => this.options[type] = baseGetOptions(searcher);
        Type.allTypes().forEach(type => Type.isSearchable(type) ? addGetOptions(type, searchers[type]) : addOptions(type));

        // for each type of tooltip builds the option selected handler
        this.tooltipSelected = {};
        Type.allTypes().forEach(type => this.tooltipSelected[type] = baseOptionSelected(type, this));

        const backgroundPh = "Search Background Names";
        const featPh = "Search Feat Names";
        const magicItemPh = "Search Item Names";
        const monsterPh = "Search Monster Names";
        const spellPh = "Search Spell Names";
        this.placeHolders = {
            [Type.Action]: "Choose an Action",
            [Type.Background]: backgroundPh,
            [Type.Condition]: "Choose a Condition",
            [Type.Equipment]: "Names, Types, Attributes, Tags, or Notes",
            [Type.Feat]: featPh,
            [Type.MagicItem]: magicItemPh,
            [Type.Monster]: monsterPh,
            [Type.Sense]: "Choose a Sense",
            [Type.Skill]: "Choose a Skill",
            [Type.Spell]: spellPh,
            [Type.WeaponProperty]: "Choose a Weapon Property",
            [Type.HomebrewBackground]: backgroundPh,
            [Type.HomebrewFeat]: featPh,
            [Type.HomebrewMagicItem]: magicItemPh,
            [Type.HomebrewMonster]: monsterPh,
            [Type.HomebrewSpell]: spellPh,
            [Type.HomebrewCollectionBackground]: backgroundPh,
            [Type.HomebrewCollectionFeat]: featPh,
            [Type.HomebrewCollectionMagicItem]: magicItemPh,
            [Type.HomebrewCollectionMonster]: monsterPh,
            [Type.HomebrewCollectionSpell]: spellPh
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

    showCollectionAlert = (type: string): boolean => {
        return Type.isHomebrewCollection(type) || Type.HomebrewCollectionBackground === type || Type.HomebrewCollectionFeat === type;
    }

    renderCeaseToWorkAlert = (type: string) => {
        if (!Type.isCustom(type) && !Type.isHomebrew(type)) return null;
        let label = "";
        if (Type.isHomebrew(type)) {
            label = "Homebrew";
        } else if ([Type.Background, Type.HomebrewBackground, Type.HomebrewCollectionBackground].some(b => b === type)) {
            label = "Background";
        } else {
            label = "Feat";
        }
        return <Alert bsStyle="warning">{label} tooltips may cease to work if the implementation of tooltips changes on DDB.</Alert>;
    }

    renderAlerts = () => {
        if (!this.state.tooltipType) return null;
        const type = this.state.tooltipType.value;
        return (
            <div>
                {this.renderCeaseToWorkAlert(type)}
                {this.showCollectionAlert(type) && <Alert bsStyle="danger">Private homebrews are only viewable by the author. Use them in private only.</Alert>}
            </div>
        );
    }

    renderTooltips = () => {
        if (!this.state.tooltipType) return null;
        const type = this.state.tooltipType.value;
        if (Type.isSearchable(type)) {
            const filter = Type.Background === type || Type.Feat === type;
            return <SearchField key={type} filter={filter} loadOptions={this.options[type]} onChange={this.tooltipSelected[type]} placeholder={this.placeHolders[type]} />;
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
                                { label: "Background (Beta)", value: Type.Background },
                                { label: "Condition", value: Type.Condition },
                                { label: "Equipment", value: Type.Equipment },
                                { label: "Feat (Beta)", value: Type.Feat },
                                { label: "Magic Item", value: Type.MagicItem },
                                { label: "Monster", value: Type.Monster },
                                { label: "Sense", value: Type.Sense },
                                { label: "Skill", value: Type.Skill },
                                { label: "Spell", value: Type.Spell },
                                { label: "Weapon Property", value: Type.WeaponProperty },
                                { label: "Homebrew Background (Beta)", value: Type.HomebrewBackground },
                                { label: "Homebrew Feat (Beta)", value: Type.HomebrewFeat },
                                { label: "Homebrew Magic Item (Beta)", value: Type.HomebrewMagicItem },
                                { label: "Homebrew Monster (Beta)", value: Type.HomebrewMonster },
                                { label: "Homebrew Spell (Beta)", value: Type.HomebrewSpell },
                                { label: "Homebrew Collection Background (Beta)", value: Type.HomebrewCollectionBackground },
                                { label: "Homebrew Collection Feat (Beta)", value: Type.HomebrewCollectionFeat },
                                { label: "Homebrew Collection Magic Item (Beta)", value: Type.HomebrewCollectionMagicItem },
                                { label: "Homebrew Collection Monster (Beta)", value: Type.HomebrewCollectionMonster },
                                { label: "Homebrew Collection Spell (Beta)", value: Type.HomebrewCollectionSpell }
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