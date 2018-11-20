import { Alert, Button, ButtonToolbar, ControlLabel, FormGroup } from 'react-bootstrap';
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

// called when the user selects a tooltip
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
            const entry: TooltipEntry = selected.value;
            const clazz = Type.getHomebrewClassName(type);

            const [, action, slug] = entry.path.split("/");
            const [id] = slug.split("-");
            const tooltipPath = `/${action}/${id}-tooltip`;

            toAddContent = `<a class="${clazz} tooltip-hover" href="https://www.dndbeyond.com${entry.path}" data-tooltip-href="https://www.dndbeyond.com${tooltipPath}">${entry.name}</a>`;
        } else if (Type.isCustom(type)) {
            const entry: TooltipEntry = selected.value;
            toAddContent = `<a class="tooltip-hover" href="https://www.dndbeyond.com${entry.path}">${entry.name}</a>`;
        }

        app.setState({ toAddContent });
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
            toAddContent: null,
            tooltipType: null
        };

        this.tooltipTypeSelect = null;

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
        this.props.onAdd(this.state.toAddContent);
    }

    addLower = () => {
        this.props.onAdd((this.state.toAddContent || "").toLowerCase());
    }

    addAndClose = () => {
        this.props.onAdd(this.state.toAddContent);
        this.props.onClose();
    }

    addLowerAndClose = () => {
        this.props.onAdd((this.state.toAddContent || "").toLowerCase());
        this.props.onClose();
    }


    isAddDisabled = () => {
        return !this.state.tooltipType || !this.state.toAddContent;
    }

    // clears content on type select
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
                            theme={SelectUtils.defaultTheme()}
                            maxMenuHeight="200px"
                            styles={SelectUtils.defaultStyle({
                                control: (styles) => ({ ...styles, height: "38px", minHeight: "38px" })
                            })}
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
                    <Button disabled={this.isAddDisabled()} onClick={this.addLowerAndClose}>
                        Add Lower Case and Close
                    </Button>
                    <Button disabled={this.isAddDisabled()} onClick={this.addLower}>
                        Add Lower Case
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