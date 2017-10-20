import './App.scss';

import React, { Component } from 'react';

import BadgeService from './services/BadgeService';
import Link from './monsterbuttons/Link';
import MonsterData from './data/MonsterData';
import MonsterEncounterData from './data/MonsterEncounterData';
import MonsterList from './MonsterList';
import MonsterListData from './data/MonsterListData';
import MonsterMenuButton from './monsterbuttons/MonsterMenuButton';
import NewEncounterModal from "./modals/NewEncounterModal";
import Select from 'react-select';
import StorageService from './services/StorageService';
import { Well } from 'react-bootstrap';
import _ from 'lodash';

/* global chrome */


/**
 * Handler called after toggle, updates the list on storage.
 */
const saveToggle = _.throttle((list: MonsterListData) => {
    const toSave = MonsterListData.savableClone(list);
    StorageService.updateData(toSave).catch((e) => { throw new Error(e); });
}, 500);

/**
 * Handler called after hp changes, updates the monster on storage.
 */
const saveHpChanged = _.throttle((monster: MonsterData) => {
    StorageService.updateData(monster).then(() => {
        BadgeService.updateBadgeCount();
    }).catch((e) => { throw new Error(e); });
}, 500);

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            encounters: [],
            activeEncounter: null,
            showNewEncounterModal: false
        };

        this.newEncounterClick = this.newEncounterClick.bind(this);
        this.activeEncounterChange = this.activeEncounterChange.bind(this);

        this.handleCloseNewEncounterModal = this.handleCloseNewEncounterModal.bind(this);
        this.handleNewEncounter = this.handleNewEncounter.bind(this);
        this.handleRemoveMonster = this.handleRemoveMonster.bind(this);
        this.handleListToggle = this.handleListToggle.bind(this);
        this.handleMonsterHpChange = this.handleMonsterHpChange.bind(this);

        this.buildList = this.buildList.bind(this);
        this.mainContent = this.mainContent.bind(this);
        this.init();

        // listen when a monster is added from AddMonsterButton, reloads
        chrome.runtime.onMessage.addListener((request, sender) => {
            this.init();
        });
    }

    init() {
        StorageService.getMonsterEncounters().then(({ active, all }) => {
            this.setState({ encounters: all, activeEncounter: active });
        }).catch(error => { throw error; });
    }

    newEncounterClick() {
        this.setState({ showNewEncounterModal: true });
    }

    activeEncounterChange(newActiveEncounter: MonsterEncounterData) {
        StorageService.getConfig().then(config => {
            config.activeEncounterId = newActiveEncounter.storageId;
            return StorageService.updateData(config);
        }).then(() => {
            this.setState({ activeEncounter: newActiveEncounter }, BadgeService.updateBadgeCount);
        });
    }

    //#region children event handlers
    handleCloseNewEncounterModal() {
        this.setState({ showNewEncounterModal: false });
    }

    handleNewEncounter(name: string) {
        StorageService.createEncounter(name).then(() => {
            this.setState({ showNewEncounterModal: false }, this.init);
        });
    }

    handleRemoveMonster(toDeleteMonster: MonsterData) {
        const toDeleteId = toDeleteMonster.storageId;
        StorageService.deleteMonster(toDeleteMonster).then(() => {
            this.setState((prevState) => {
                prevState.activeEncounter.lists.forEach((list, metaIndex) => {
                    list.monsters.forEach((monster, monsterIndex) => {
                        if (monster.storageId !== toDeleteId) return;
                        list.monsters.splice(monsterIndex, 1);
                        if (list.monsters.length === 0) prevState.activeEncounter.lists.splice(metaIndex, 1);
                    });
                });
                return { activeEncounter: prevState.activeEncounter };
            });
            BadgeService.updateBadgeCount();
        });
    }

    handleListToggle(list: MonsterListData) {
        list.collapsed = !list.collapsed;
        this.setState({ activeEncounter: this.state.activeEncounter }, () => saveToggle(list));
    }

    handleMonsterHpChange(monster: MonsterData, newHp: number) {
        return new Promise((resolve, reject) => {
            monster.currentHp = newHp;
            this.setState({ activeEncounter: this.state.activeEncounter }, () => {
                saveHpChanged(monster);
                resolve();
            });
        });
    }
    //#endregion

    //#region renderer
    buildList() {
        const encounter: MonsterEncounterData = this.state.activeEncounter;
        if (!encounter) return "";
        return encounter.lists.map((list, index) => {
            const id = list.monsterId;
            const last = encounter.lists.length - 1 === index;
            return (
                <li className={last ? "Monster-list-last" : ""} key={id}>
                    <MonsterList list={list} onRemoveMonster={this.handleRemoveMonster} onToggle={this.handleListToggle} onMonsterHpChange={this.handleMonsterHpChange} />
                </li>
            );
        });
    }

    mainContent() {
        const encounter: MonsterEncounterData = this.state.activeEncounter;
        if (!encounter) return <span />;
        if (encounter.lists && encounter.lists.length > 0) return <ul>{this.buildList()}</ul>;

        const base = "https://www.dndbeyond.com";
        const goblin = <Link address={`${base}/monsters/goblin`}>Goblin</Link>;
        const mList = <Link address={`${base}/monsters`}>Monsters Listing</Link>;
        const mHomebrew = <Link address={`${base}/homebrew/monsters`}>Homebrew Monsters Listing</Link>;
        const hCollection = <Link address={`${base}/homebrew/collection`}>Homebrew Collection</Link>;
        const hCreation = <Link address={`${base}/homebrew/creations`}>Homebrew Creations</Link>;

        return (
            <Well className="Monster-empty-list">
                <p>No monsters added. Try to add a {goblin}. Monsters can also be added from the expanded details of {mList}, {mHomebrew}, {hCollection} and {hCreation}.</p>
            </Well>
        );
    }

    render() {
        return (
            <div>
                <div className="Monster-encounter-menu">
                    <MonsterMenuButton icon="glyphicon-file" title="New Encounter" onClick={this.newEncounterClick} />
                    <MonsterMenuButton icon="glyphicon-trash" title="Delete Encounter" />
                    <Select
                        className="Monster-encounter-select"
                        labelKey="name"
                        valueKey="storageId"
                        noResultsText="No encounters found"
                        autoBlur
                        value={this.state.activeEncounter}
                        options={this.state.encounters}
                        onChange={this.activeEncounterChange}
                    />
                </div>

                {this.mainContent()}

                <NewEncounterModal show={this.state.showNewEncounterModal} onHide={this.handleCloseNewEncounterModal} onSave={this.handleNewEncounter} />
            </div >
        );
    }
    //#endregion
}

export default App;
