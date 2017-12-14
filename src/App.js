import './App.scss';

import React, { Component } from 'react';

import $ from "jquery";
import BadgeService from './services/BadgeService';
import C from "./Constants";
import ConfigStorageService from './services/storage/ConfigStorageService';
import ConfirmDialog from "./modals/ConfirmDialog";
import EncounterOptionsModal from "./modals/EncounterOptionsModal";
import Link from './monsterbuttons/Link';
import ListOptionsModal from "./modals/ListOptionsModal";
import MonsterData from './data/MonsterData';
import MonsterEncounterData from './data/MonsterEncounterData';
import MonsterEncounterStorageService from './services/storage/MonsterEncounterStorageService';
import MonsterList from './MonsterList';
import MonsterListData from './data/MonsterListData';
import MonsterListStorageService from './services/storage/MonsterListStorageService';
import MonsterMenuButton from './monsterbuttons/MonsterMenuButton';
import MonsterOptionsModal from "./modals/MonsterOptionsModal";
import MonsterStorageService from './services/storage/MonsterStorageService';
import NewEncounterModal from "./modals/NewEncounterModal";
import Select from 'react-select';
import StorageService from './services/storage/StorageService';
import { Well } from 'react-bootstrap';
import { throttle } from 'lodash';

/* global chrome */


/**
 * Handler called after toggle, updates the list on storage.
 */
const saveToggle = throttle((list: MonsterListData) => {
    StorageService.updateData(list).catch((e) => { throw new Error(e); });
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
            showDeleteEncounterDialog: false,
            showDeleteListDialog: false,
            monsterOptions: {
                show: false,
                monster: null,
                monsterEl: null,
                list: null
            },
            listOptions: {
                show: false,
                list: null,
                llistEl: null
            },
            encounterOptions: {
                show: false,
                deleteEnabled: false
            }
        };

        this.init();

        // listen when a monster is added from AddMonsterButton, reloads
        chrome.runtime.onMessage.addListener((request, sender) => {
            this.init();
        });
    }

    init = () => {
        return MonsterEncounterStorageService.getMonsterEncounters().then(({ active, all }) => {
            this.setState({
                encounters: all,
                activeEncounter: active,
                showNewEncounterModal: false,
                showDeleteEncounterDialog: false
            });
        }).catch(error => { throw error; });
    }

    dialogOpenClass = () => {
        const s = this.state;
        const states = [
            s.showNewEncounterModal, s.showDeleteEncounterDialog, s.showDeleteListDialog,
            s.monsterOptions.show, s.listOptions.show, s.encounterOptions.show
        ];
        return states.some(state => state) ? "Dialog-opened" : "";
    }

    /**
     * onChange of encounter select
     */
    activeEncounterChange = (newActiveEncounter: MonsterEncounterData) => {
        ConfigStorageService.getConfig().then(config => {
            config.activeEncounterId = newActiveEncounter.storageId;
            return StorageService.updateData(config);
        }).then(() => {
            this.setState({ activeEncounter: newActiveEncounter }, BadgeService.updateBadgeCount);
        });
    }

    canDeleteEncounter = () => {
        return this.state.encounters && this.state.encounters.length > 1;
    }

    reloadHandler = (beforeReload: Function) => {
        return () => {
            if (beforeReload) beforeReload();
            BadgeService.updateBadgeCount();
            this.init();
        };
    }

    //#region children event handlers
    /**
     * onSave of new encounter modal
     */
    handleNewEncounter = (name: string) => {
        MonsterEncounterStorageService.createEncounter(name).then(() => {
            this.setState({ showNewEncounterModal: false }, () => this.init().then(BadgeService.updateBadgeCount));
        });
    }

    /**
     * onClick of monster list header
     */
    handleListToggle = (list: MonsterListData) => {
        list.collapsed = !list.collapsed;
        this.setState({ activeEncounter: this.state.activeEncounter }, () => saveToggle(list));
    }

    /**
     * called by both change hp by form and and change hp by scroll
     */
    handleMonsterHpChange = (monster: MonsterData, newHp: number) => {
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
    handleMonsterRightClick = (monster: MonsterData, monsterEl: HTMLElement, list: MonsterListData) => {
        this.setState({ monsterOptions: { show: true, monster, monsterEl, list } });
    }

    closeMonsterOptions = () => {
        this.setState({ monsterOptions: { show: false, monster: null, monsterEl: null, list: null } });
    }
    //#endregion

    //#region list options
    handleListRightClick = (list: MonsterListData, listEl: HTMLElement) => {
        this.setState({ listOptions: { show: true, list, listEl } });
    }

    closeListOptions = () => {
        this.setState({ listOptions: { show: false, list: null, listEl: null } });
    }

    openDeleteListDialog = () => {
        this.setState(prev => {
            const listOptions = prev.listOptions;
            listOptions.show = false;
            return { listOptions, showDeleteListDialog: true };
        });
    }

    cancelDeleteList = () => {
        this.setState({ listOptions: { show: false, list: null, listEl: null }, showDeleteListDialog: false });
    }

    handleDeleteList = () => {
        const toDeleteList: MonsterListData = this.state.listOptions.list;
        const listEl = this.state.listOptions.listEl;
        this.setState({ showDeleteListDialog: false });
        $(listEl).fadeOut(400, () => {
            MonsterListStorageService.deleteList(toDeleteList).then(() => {
                BadgeService.updateBadgeCount();
                this.reloadHandler(this.closeListOptions)();
            });
        });
    }
    //#endregion

    //#region encounter options
    openEncounterOptions = () => {
        this.setState({ encounterOptions: { show: true, deleteEnabled: this.canDeleteEncounter() } });
    }

    closeEncounterOptions = () => {
        this.setState({ encounterOptions: { show: false, deleteEnabled: false } });
    }

    openDeleteEncounterDialog = () => {
        this.setState(prev => {
            const encounterOptions = prev.encounterOptions;
            encounterOptions.show = false;
            return { encounterOptions, showDeleteEncounterDialog: true };
        });
    }

    handleDeleteEncounter = () => {
        const nextActiveEncounter = this.state.encounters.find((encounter) => encounter.storageId !== this.state.activeEncounter.storageId);
        MonsterEncounterStorageService.deleteEncounter(this.state.activeEncounter, nextActiveEncounter).then(() => {
            return this.init();
        }).then(BadgeService.updateBadgeCount);
    }
    //#endregion

    //#region renderer
    buildLists = () => {
        const encounter: MonsterEncounterData = this.state.activeEncounter;
        if (!encounter) return "";
        return encounter.lists.map((list, index) => {
            const id = list.monsterId;
            const last = encounter.lists.length - 1 === index;
            return (
                <li className={last ? "Monster-list-last" : ""} key={id}>
                    <MonsterList
                        list={list}
                        encounter={this.state.activeEncounter}
                        onToggle={this.handleListToggle}
                        onMonsterHpChange={this.handleMonsterHpChange}
                        onMonsterRightClick={this.handleMonsterRightClick}
                        onRightClick={this.handleListRightClick}
                    />
                </li>
            );
        });
    }

    /**
     * either a message of no monsters or the monster lists
     */
    renderMainContent = () => {
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

    renderModalsAndDialogs = () => {
        return (
            <div>
                <NewEncounterModal
                    key={"new-encounter-modal-" + this.state.showNewEncounterModal}
                    show={this.state.showNewEncounterModal}
                    onHide={() => this.setState({ showNewEncounterModal: false })}
                    onSave={this.handleNewEncounter}
                />
                <ConfirmDialog
                    show={this.state.showDeleteEncounterDialog}
                    message="Are you sure you want to delete this encounter and all monsters in it?"
                    onCancel={() => this.setState({ showDeleteEncounterDialog: false })}
                    confirmButtonStyle="danger"
                    confirmLabel="Delete"
                    onConfirm={this.handleDeleteEncounter}
                />
                <ConfirmDialog
                    show={this.state.showDeleteListDialog}
                    message="Are you sure you want to delete this list and all monsters in it?"
                    onCancel={this.cancelDeleteList}
                    confirmButtonStyle="danger"
                    confirmLabel="Delete"
                    onConfirm={this.handleDeleteList}
                />
                <EncounterOptionsModal
                    key={"encounter-option-modal-" + this.state.encounterOptions.show}
                    show={this.state.encounterOptions.show}
                    context={this.state.encounterOptions}
                    encounter={this.state.activeEncounter}
                    onHide={this.closeEncounterOptions}
                    onChange={this.reloadHandler(this.closeEncounterOptions)}
                    onDelete={this.openDeleteEncounterDialog}
                />
                <ListOptionsModal
                    key={"list-option-modal-" + this.state.listOptions.show}
                    show={this.state.listOptions.show}
                    context={this.state.listOptions}
                    encounter={this.state.activeEncounter}
                    onHide={this.closeListOptions}
                    onChange={this.reloadHandler(this.closeListOptions)}
                    onDelete={this.openDeleteListDialog}
                />
                <MonsterOptionsModal
                    key={"monster-option-modal-" + this.state.monsterOptions.show}
                    show={this.state.monsterOptions.show}
                    context={this.state.monsterOptions}
                    encounter={this.state.activeEncounter}
                    onHide={this.closeMonsterOptions}
                    onChange={this.reloadHandler(this.closeMonsterOptions)}
                />
            </div>
        );
    }

    render() {
        return (
            <div className={this.dialogOpenClass()} onContextMenu={(e) => e.preventDefault()}>
                <div className="Monster-encounter-menu">
                    <MonsterMenuButton className="btn" icon="glyphicon-file" title="New Encounter" onClick={() => this.setState({ showNewEncounterModal: true })} />
                    <MonsterMenuButton className="btn" icon="glyphicon-cog" title="Encounter Options" onClick={this.openEncounterOptions} />
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

                {this.renderMainContent()}

                {this.renderModalsAndDialogs()}
            </div >
        );
    }
    //#endregion
}

export default App;