import 'react-select/dist/react-select.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import './TinyMCEApp.scss';

import React, { Component } from 'react';

import { Async } from 'react-select';
import { Button, ControlLabel, FormGroup, Nav, NavItem } from 'react-bootstrap';
import C from "../../Constants";
import DDBSearchService from "../../services/DDBSearchService";
import MessageService from "../../services/MessageService";
import debounce from "debounce-promise";

/* global chrome */

const tooltipsTabId = "tooltips";
const extraTooltipsTabId = "etooltips";
const homebrewTooltipsTabId = "htooltips";

const baseGetOptionsSearcher = function (ddbSearcher: Function, pageSize = 20) {
    return debounce((input) => {
        return ddbSearcher(input).then((results) => {
            results = results || [];
            return {
                options: results.map(result => {
                    result = result ? result.trim() : "";
                    return { label: result, value: result };
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

const baseOptionSelected = function (tag: string) {
    return (selected) => {
        const content = `[${tag}]${selected.value}[/${tag}]`;
        chrome.tabs.getCurrent(tab => {
            MessageService.sendToTab(tab.id, C.AddContentToTinyMessage, { content });
        });
    };
};

const magicItemSearcher = baseGetOptionsSearcher(DDBSearchService.magicItems);
const equipSearcher = baseGetOptionsSearcher(DDBSearchService.equipment, 30);
const spellSearcher = baseGetOptionsSearcher(DDBSearchService.spells);
const monsterSearcher = baseGetOptionsSearcher(DDBSearchService.monsters);

class TinyMCEApp extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeTab: tooltipsTabId
        };
    }

    cancel = () => {
        chrome.tabs.getCurrent(tab => MessageService.sendToTab(tab.id, C.CloseTinyMessage));
    }

    getMagicItems = baseGetOptions(magicItemSearcher);
    magicItemSelected = baseOptionSelected("magicItem");

    getEquips = baseGetOptions(equipSearcher);
    equipSelected = baseOptionSelected("item");

    getSpells = baseGetOptions(spellSearcher);
    spellSelected = baseOptionSelected("spell");

    getMonsters = baseGetOptions(monsterSearcher);
    monsterSelected = baseOptionSelected("monster");

    renderTooltips = () => {
        return (
            <form>
                <FormGroup>
                    <ControlLabel>Magic Item</ControlLabel>
                    <Async
                        autoload={false}
                        onBlurResetsInput={false}
                        filterOptions={false}
                        loadOptions={this.getMagicItems}
                        onChange={this.magicItemSelected}
                        placeholder="Search a Magic Item"
                        searchPromptText="No results."
                        value={null}
                    />
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Equipment</ControlLabel>
                    <Async
                        autoload={false}
                        onBlurResetsInput={false}
                        filterOptions={false}
                        loadOptions={this.getEquips}
                        onChange={this.equipSelected}
                        placeholder="Search a Equipment"
                        searchPromptText="No results."
                        value={null}
                    />
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Spell</ControlLabel>
                    <Async
                        autoload={false}
                        onBlurResetsInput={false}
                        filterOptions={false}
                        loadOptions={this.getSpells}
                        onChange={this.spellSelected}
                        placeholder="Search a Spell"
                        searchPromptText="No results."
                        value={null}
                    />
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Monster</ControlLabel>
                    <Async
                        autoload={false}
                        onBlurResetsInput={false}
                        filterOptions={false}
                        loadOptions={this.getMonsters}
                        onChange={this.monsterSelected}
                        placeholder="Search a Monster"
                        searchPromptText="No results."
                        value={null}
                    />
                </FormGroup>
            </form>
        );
    }

    renderContent = () => {
        if (this.state.activeTab === tooltipsTabId) return this.renderTooltips();
        return null;
    }

    render() {
        return (
            <div>
                <Nav bsStyle="tabs" activeKey={this.state.activeTab} onSelect={(activeTab) => this.setState({ activeTab })}>
                    <NavItem eventKey={tooltipsTabId} title="Tooltips">Tooltips</NavItem>
                    <NavItem eventKey={extraTooltipsTabId} title="Extra Tooltips">Extra Tooltips</NavItem>
                    <NavItem eventKey={homebrewTooltipsTabId} title="Homebrew Tooltips">Homebrew Tooltips</NavItem>
                </Nav>

                <div className="bh-content-panel">{this.renderContent()}</div>

                <Button className="bh-cancel-button" onClick={this.cancel}>
                    Cancel
                </Button>
            </div>
        );
    }
}

export default TinyMCEApp;