import './App.scss';

import React, { Component } from 'react';

import $ from "jquery";
import BadgeService from './services/BadgeService';
import C from "./Constants";
import DeleteEncounterAlert from "./modals/DeleteEncounterAlert";
import Link from './monsterbuttons/Link';
import MonsterData from './data/MonsterData';
import MonsterEncounterData from './data/MonsterEncounterData';
import MonsterList from './MonsterList';
import MonsterListData from './data/MonsterListData';
import MonsterMenuButton from './monsterbuttons/MonsterMenuButton';
import MonsterOptionsModal from "./modals/MonsterOptionsModal";
import NewEncounterModal from "./modals/NewEncounterModal";
import Select from 'react-select';
import StorageService from './services/StorageService';
import { Well } from 'react-bootstrap';
import { throttle } from 'lodash';

/* global chrome */


/**
 * Handler called after toggle, updates the list on storage.
 */
const saveToggle = throttle((list: MonsterListData) => {
    const toSave = MonsterListData.savableClone(list);
    StorageService.updateData(toSave).catch((e) => { throw new Error(e); });
}, 500);

/**
 * Handler called after hp changes, updates the monster on storage.
 */
const saveHpChanged = throttle((monster: MonsterData) => {
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
            showNewEncounterModal: false,
            showDeleteEncounterAlert: false,
            monsterOptions: {
                show: false,
                monster: null,
                monsterEl: null,
                list: null,
                key: null
            }
        };

        this.activeEncounterChange = this.activeEncounterChange.bind(this);
        this.canDeleteEncounter = this.canDeleteEncounter.bind(this);

        this.handleNewEncounter = this.handleNewEncounter.bind(this);
        this.handleDeleteEncounter = this.handleDeleteEncounter.bind(this);
        this.handleListToggle = this.handleListToggle.bind(this);
        this.handleMonsterHpChange = this.handleMonsterHpChange.bind(this);

        this.handleMonsterRightClick = this.handleMonsterRightClick.bind(this);
        this.closeMonsterOptions = this.closeMonsterOptions.bind(this);
        this.handleDeleteMonster = this.handleDeleteMonster.bind(this);
        this.handleFullHealMonster = this.handleFullHealMonster.bind(this);
        this.handleKillMonster = this.handleKillMonster.bind(this);
        this.handleNameColorChange = this.handleNameColorChange.bind(this);

        this.buildLists = this.buildLists.bind(this);
        this.mainContent = this.mainContent.bind(this);
        this.init();

        // listen when a monster is added from AddMonsterButton, reloads
        chrome.runtime.onMessage.addListener((request, sender) => {
            this.init();
        });
    }

    init() {
        return StorageService.getMonsterEncounters().then(({ active, all }) => {
            this.setState({
                encounters: all,
                activeEncounter: active,
                showNewEncounterModal: false,
                showDeleteEncounterAlert: false
            });
        }).catch(error => { throw error; });
    }

    /**
     * onChange of encounter select
     */
    activeEncounterChange(newActiveEncounter: MonsterEncounterData) {
        StorageService.getConfig().then(config => {
            config.activeEncounterId = newActiveEncounter.storageId;
            return StorageService.updateData(config);
        }).then(() => {
            this.setState({ activeEncounter: newActiveEncounter }, BadgeService.updateBadgeCount);
        });
    }

    canDeleteEncounter() {
        return this.state.encounters && this.state.encounters.length > 1;
    }

    //#region children event handlers
    /**
     * onSave of new encounter modal
     */
    handleNewEncounter(name: string) {
        StorageService.createEncounter(name).then(() => {
            this.setState({ showNewEncounterModal: false }, () => this.init().then(BadgeService.updateBadgeCount));
        });
    }

    /**
     * onDelete of delete encounter alert
     */
    handleDeleteEncounter() {
        const nextActiveEncounter = this.state.encounters.find((encounter) => encounter.storageId !== this.state.activeEncounter.storageId);
        StorageService.deleteEncounter(this.state.activeEncounter, nextActiveEncounter).then(() => {
            return this.init();
        }).then(BadgeService.updateBadgeCount);
    }

    /**
     * onClick of monster list header
     */
    handleListToggle(list: MonsterListData) {
        list.collapsed = !list.collapsed;
        this.setState({ activeEncounter: this.state.activeEncounter }, () => saveToggle(list));
    }

    /**
     * called by both change hp by form and and change hp by scroll
     */
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

    //#region monster options
    /**
     * OnRightClick on monster
     */
    handleMonsterRightClick(monster: MonsterData, monsterEl: HTMLElement, list: MonsterListData) {
        this.setState({ monsterOptions: { show: true, monster, monsterEl, list, key: new Date().getTime() } });
    }

    closeMonsterOptions() {
        this.setState({ monsterOptions: { show: false, monster: null, monsterEl: null, list: null, key: null } });
    }

    /**
     * onClick of delete of monsters options
     */
    handleDeleteMonster() {
        const toDeleteMonster = this.state.monsterOptions.monster;
        const monsterEl = this.state.monsterOptions.monsterEl;
        this.closeMonsterOptions();
        $(monsterEl).fadeOut(400, () => {
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
        });
    }

    handleFullHealMonster() {
        const toHealMonster: MonsterData = this.state.monsterOptions.monster;
        toHealMonster.currentHp = toHealMonster.hp;
        this.setState({ activeEncounter: this.state.activeEncounter }, () => {
            saveHpChanged(toHealMonster);
            this.closeMonsterOptions();
        });
    }

    handleKillMonster() {
        const toKillMonster: MonsterData = this.state.monsterOptions.monster;
        toKillMonster.currentHp = 0;
        this.setState({ activeEncounter: this.state.activeEncounter }, () => {
            saveHpChanged(toKillMonster);
            this.closeMonsterOptions();
        });
    }

    handleNameColorChange({ name, color, textColor }) {
        const monster: MonsterData = this.state.monsterOptions.monster;
        monster.name = name;
        monster.color = color;
        monster.textColor = textColor;
        this.setState({ activeEncounter: this.state.activeEncounter }, () => {
            StorageService.updateData(monster).then(() => this.closeMonsterOptions());
        });
    }
    //#endregion

    //#region renderer
    buildLists() {
        const encounter: MonsterEncounterData = this.state.activeEncounter;
        if (!encounter) return "";
        return encounter.lists.map((list, index) => {
            const id = list.monsterId;
            const last = encounter.lists.length - 1 === index;
            return (
                <li className={last ? "Monster-list-last" : ""} key={id}>
                    <MonsterList
                        list={list}
                        onToggle={this.handleListToggle}
                        onMonsterHpChange={this.handleMonsterHpChange}
                        onMonsterRightClick={this.handleMonsterRightClick}
                    />
                </li>
            );
        });
    }

    /**
     * either a message of no monsters or the monster lists
     */
    mainContent() {
        const encounter: MonsterEncounterData = this.state.activeEncounter;
        if (!encounter) return <span />;
        if (encounter.lists && encounter.lists.length > 0) return <ul>{this.buildLists()}</ul>;

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
            <div onContextMenu={(e) => e.preventDefault()}>
                <div className="Monster-encounter-menu">
                    <MonsterMenuButton className="btn" icon="glyphicon-file" title="New Encounter" onClick={() => this.setState({ showNewEncounterModal: true })} />
                    <MonsterMenuButton
                        className={`btn ${this.canDeleteEncounter() ? "" : "disabled"}`}
                        icon="glyphicon-trash"
                        title="Delete Encounter"
                        onClick={() => this.setState({ showDeleteEncounterAlert: true })}
                    />
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

                <NewEncounterModal
                    show={this.state.showNewEncounterModal}
                    onHide={() => this.setState({ showNewEncounterModal: false })}
                    onSave={this.handleNewEncounter}
                />
                <DeleteEncounterAlert
                    show={this.state.showDeleteEncounterAlert}
                    onHide={() => this.setState({ showDeleteEncounterAlert: false })}
                    onDelete={this.handleDeleteEncounter}
                />
                <MonsterOptionsModal
                    key={"option-modal-" + this.state.monsterOptions.key}
                    show={this.state.monsterOptions.show}
                    context={this.state.monsterOptions}
                    onHide={this.closeMonsterOptions}
                    onDelete={this.handleDeleteMonster}
                    onFullHeal={this.handleFullHealMonster}
                    onKill={this.handleKillMonster}
                    onNameColorChange={this.handleNameColorChange}
                />
            </div >
        );
    }
    //#endregion
}

export default App;