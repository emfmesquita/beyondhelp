import { Alert, Button, ButtonToolbar, ControlLabel, Form, FormGroup, FormControl, InputGroup, Glyphicon } from 'react-bootstrap';
import React, { Component } from 'react';

import C from "../../Constants";
import DDBSearchService from "../../services/DDBSearchService";
import Opt from "../../Options";
import ReactDOM from 'react-dom';
import SearchField from "../../forms/SearchField";
import Select from 'react-select';
import SelectField from "../../forms/SelectField";
import SelectUtils from '../../forms/SelectUtils';
import TooltipEntry from "../../data/TooltipEntry";
import TooltipOptions from "../tooltips/TooltipOptions";
import Type from "../tooltips/TooltipType";
import debounce from "debounce-promise";

/**
 * Builds a debounced option searcher.
 */
const baseGetOptionsSearcher = function (ddbSearcher: Function, isHomebrewOrCustom: boolean, pageSize = 20) {
    return debounce((input) => {
        return ddbSearcher(input).then(results => {
            results = results || [];
            return results.map(r => {
                let label = null;
                if (!isHomebrewOrCustom) {
                    label = r;
                } else {
                    const autorSufix = r.author ? " - " + r.author : "";
                    const versionSufix = r.version ? " - v" + r.version : "";
                    label = r.name + autorSufix + versionSufix;
                }
                return { label, value: r };
            });
        }).catch(() => { return { options: [] }; });
    }, 500);
};

const baseGetOptions = function (searcher: Function) {
    return (input) => {
        if (!input) return Promise.resolve({ options: [] });
        return searcher(input);
    };
};

const optionToDisplayText = (type: string, option) => {
    if (!option) return "";
    if (Type.isCommon(type)) return option.value;
    const entry: TooltipEntry = option.value;
    return entry.name;
};

// build the tooltip text content
const baseBuildContent = function (type: string, app: TinyMCEApp): string {
    return (selected, displayText: string) => {
        const originalText = optionToDisplayText(type, selected);
        const hasDisplayText = displayText && displayText !== originalText;

        // builds the content to add to editor
        // tag if normal and anchor if homebrew or custom
        let toAddContent = "";
        if (Type.isCommon(type)) {
            const tag = Type.getTag(type);
            const displayExtra = (hasDisplayText ? `;${displayText.replace(/;/g, "")}` : "");
            return `[${tag}]${originalText}${displayExtra}[/${tag}]`;
        }

        const toDisplay = displayText || originalText;

        if (Type.isHomebrew(type)) {
            const entry: TooltipEntry = selected.value;
            const clazz = Type.getHomebrewClassName(type);

            const [, action, slug] = entry.path.split("/");
            const [id] = slug.split("-");
            const tooltipPath = `/${action}/${id}-tooltip`;

            return `<a class="${clazz} tooltip-hover" href="https://www.dndbeyond.com${entry.path}" data-tooltip-href="https://www.dndbeyond.com${tooltipPath}">${toDisplay}</a>`;
        }

        const entry: TooltipEntry = selected.value;
        return `<a class="tooltip-hover" href="https://www.dndbeyond.com${entry.path}#${originalText}">${toDisplay}</a>`;
    };
};

// array of searcers, they are responsible to search options on ddb pages
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

class TinyMCETooltipsTab extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tooltipType: null,
            selectedTooltip: null,
            displayText: ""
        };

        this.tooltipTypeSelect = null;

        // for each type of tooltip builds option list or getOptions function
        this.options = {};
        const addOptions = (type) => this.options[type] = TooltipOptions.getOptions(type);
        const addGetOptions = (type, searcher) => this.options[type] = baseGetOptions(searcher);
        Type.allTypes().forEach(type => Type.isSearchable(type) ? addGetOptions(type, searchers[type]) : addOptions(type));

        // for each type of tooltip builds the function to generate content
        this.buildContent = {};
        Type.allTypes().forEach(type => this.buildContent[type] = baseBuildContent(type, this));

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

        // tooltip types options - some may not show due to config off
        const selOpts = [];
        const addHB = props.config[Opt.HomebrewTooltips];
        const addCust = props.config[Opt.CustomTooltips];
        selOpts.push({ label: "Action", value: Type.Action });
        addCust && selOpts.push({ label: "Background (Beta)", value: Type.Background });
        selOpts.push({ label: "Condition", value: Type.Condition });
        selOpts.push({ label: "Equipment", value: Type.Equipment });
        addCust && selOpts.push({ label: "Feat (Beta)", value: Type.Feat });
        selOpts.push({ label: "Magic Item", value: Type.MagicItem });
        selOpts.push({ label: "Monster", value: Type.Monster });
        selOpts.push({ label: "Sense", value: Type.Sense });
        selOpts.push({ label: "Skill", value: Type.Skill });
        selOpts.push({ label: "Spell", value: Type.Spell });
        selOpts.push({ label: "Weapon Property", value: Type.WeaponProperty });
        addHB && addCust && selOpts.push({ label: "Homebrew Background (Beta)", value: Type.HomebrewBackground });
        addHB && addCust && selOpts.push({ label: "Homebrew Feat (Beta)", value: Type.HomebrewFeat });
        addHB && selOpts.push({ label: "Homebrew Magic Item (Beta)", value: Type.HomebrewMagicItem });
        addHB && selOpts.push({ label: "Homebrew Monster (Beta)", value: Type.HomebrewMonster });
        addHB && selOpts.push({ label: "Homebrew Spell (Beta)", value: Type.HomebrewSpell });
        addHB && addCust && selOpts.push({ label: "Homebrew Collection Background (Beta)", value: Type.HomebrewCollectionBackground });
        addHB && addCust && selOpts.push({ label: "Homebrew Collection Feat (Beta)", value: Type.HomebrewCollectionFeat });
        addHB && selOpts.push({ label: "Homebrew Collection Magic Item (Beta)", value: Type.HomebrewCollectionMagicItem });
        addHB && selOpts.push({ label: "Homebrew Collection Monster (Beta)", value: Type.HomebrewCollectionMonster });
        addHB && selOpts.push({ label: "Homebrew Collection Spell (Beta)", value: Type.HomebrewCollectionSpell });
        this.typeSelectOptions = selOpts;
    }

    // focus type selector on mount
    componentDidMount() {
        if (this.tooltipTypeSelect && this.props.shouldFocus) this.tooltipTypeSelect.focus();
    }

    add = () => {
        const selected = this.state.selectedTooltip;
        const displayText = this.state.displayText;
        const type = this.state.tooltipType.value;
        this.props.onAdd(this.buildContent[type](selected, displayText));
    }

    addAndClose = () => {
        this.add();
        this.props.onClose();
    }

    isAddDisabled = () => {
        return !this.state.tooltipType || !this.state.selectedTooltip;
    }

    // clears content on type select
    tooltipTypeSelected = (value) => {
        this.setState({ tooltipType: value, selectedTooltip: null, displayText: "" });
    }

    handleTooltipSelected = (option) => {
        this.setState({ selectedTooltip: option, displayText: optionToDisplayText(this.state.tooltipType.value, option) });
    }

    handleDisplayTextChage = (e) => {
        const text = e.target.value;
        this.setState({ displayText: text ? text : optionToDisplayText(this.state.tooltipType.value, this.state.selectedTooltip) });
    }

    handleToLower = () => {
        this.setState({ displayText: this.state.displayText.toLowerCase() });
    }

    handleBackToDefault = () => {
        this.setState({ displayText: optionToDisplayText(this.state.tooltipType.value, this.state.selectedTooltip) });
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
            return <SearchField key={type} filter={filter} loadOptions={this.options[type]} onChange={this.handleTooltipSelected} placeholder={this.placeHolders[type]} />;
        }
        return <SelectField key={type} options={this.options[type]} onChange={this.handleTooltipSelected} placeholder={this.placeHolders[type]} />;
    }

    renderTextToDisplayField = () => {
        if (!this.state.tooltipType) return null;
        return (
            <FormGroup>
                <ControlLabel>Display Text</ControlLabel>
                <InputGroup>
                    <FormControl
                        type="text"
                        value={this.state.displayText}
                        placeholder="Enter Display Text"
                        disabled={!this.state.selectedTooltip}
                        onChange={this.handleDisplayTextChage}
                    />
                    <InputGroup.Button>
                        <Button title="To Lower Case" disabled={!this.state.selectedTooltip} onClick={this.handleToLower}>
                            <Glyphicon glyph="arrow-down" />
                        </Button>
                        <Button title="Back to Default" disabled={!this.state.selectedTooltip} onClick={this.handleBackToDefault}>
                            <Glyphicon glyph="erase" />
                        </Button>
                    </InputGroup.Button>
                </InputGroup>
            </FormGroup>
        );
    }

    render() {
        return (
            <div>
                <form className="bh-content-panel">
                    <FormGroup>
                        <ControlLabel>Type</ControlLabel>
                        <Select
                            classNamePrefix="bh-select"
                            onChange={this.tooltipTypeSelected}
                            options={this.typeSelectOptions}
                            value={this.state.tooltipType}
                            placeholder="Select Tooltip Type"
                            ref={(el) => this.tooltipTypeSelect = el}
                            maxMenuHeight="200px"
                            theme={SelectUtils.defaultTheme()}
                            styles={SelectUtils.defaultStyle()}
                        />
                    </FormGroup>
                    {this.renderTooltips()}
                    {this.renderTextToDisplayField()}
                    {this.renderAlerts()}
                </form>

                <ButtonToolbar className="bh-button-toolbar">
                    <Button bsStyle="primary" disabled={this.isAddDisabled()} onClick={this.addAndClose}>
                        Add and Close
                    </Button>
                    <Button disabled={this.isAddDisabled()} onClick={this.add}>
                        Add
                    </Button>
                    <Button onClick={this.props.onClose}>
                        Close
                    </Button>
                </ButtonToolbar>
            </div>
        );
    }
}

export default TinyMCETooltipsTab;