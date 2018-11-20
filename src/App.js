import './App.scss';

import React, { Component } from 'react';

import $ from "jquery";
import BadgeService from './services/BadgeService';
import C from "./Constants";
import ConfigStorageService from './services/storage/ConfigStorageService';
import ConfirmDialog from "./modals/ConfirmDialog";
import EncounterOptionsModal from "./modals/EncounterOptionsModal";
import Link from './buttons/Link';
import LinkService from "./services/LinkService";
import ListOptionsModal from "./modals/ListOptionsModal";
import MenuButton from './buttons/MenuButton';
import MessageService from './services/MessageService';
import MonsterData from './data/MonsterData';
import MonsterEncounterData from './data/MonsterEncounterData';
import MonsterEncounterStorageService from './services/storage/MonsterEncounterStorageService';
import MonsterList from './MonsterList';
import MonsterListData from './data/MonsterListData';
import MonsterListStorageService from './services/storage/MonsterListStorageService';
import MonsterOptionsModal from "./modals/MonsterOptionsModal";
import MonsterStorageService from './services/storage/MonsterStorageService';
import MonstersService from './services/MonstersService';
import NewEncounterModal from "./modals/NewEncounterModal";
import ScrollService from './services/ScrollService';
import Select from 'react-select';
import SyncStorageService from './services/storage/SyncStorageService';
import { Well } from 'react-bootstrap';
import { throttle } from 'lodash';

/* global chrome */

ScrollService.loadScrollPosition().then(ScrollService.watchScrollChange);

/**
 * Handler called after toggle, updates the list on storage.
 */
const saveToggle = throttle((list: MonsterListData) => {
    SyncStorageService.updateData(list).catch((e) => { throw new Error(e); });
}, 500);

/**
 * Handler called after hp changes, updates the monster on storage.
 */
const saveHpChanged = throttle((monster: MonsterData) => {
    SyncStorageService.updateData(monster).then(() => {
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
            showOpenAllDetailsDialog: false,
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

        this.load();

        // listen when a monster is added from AddMonsterButton, reloads
        MessageService.listen(C.ReloadMessage, () => this.load());
    }

    load = () => {
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
            return SyncStorageService.updateData(config);
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
            this.load();
        };
    }

    //#region children event handlers
    /**
     * onSave of new encounter modal
     */
    handleNewEncounter = (name: string) => {
        MonsterEncounterStorageService.createEncounter(name).then(() => {
            this.setState({ showNewEncounterModal: false }, () => this.load().then(BadgeService.updateBadgeCount));
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

    openDetailsPagesDialog = () => {
        this.setState(prev => {
            const encounterOptions = prev.encounterOptions;
            encounterOptions.show = false;
            return { encounterOptions, showOpenAllDetailsDialog: true };
        });
    }

    handleOpenDetailsPages = () => {
        this.setState({ showOpenAllDetailsDialog: false });
        MonstersService.openDetailsPages(this.state.activeEncounter);
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
            return this.load();
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
                <ConfirmDialog
                    show={this.state.showOpenAllDetailsDialog}
                    message={`Are you sure you want to open ${MonstersService.notCustomMonsterLists(this.state.activeEncounter).length} new tabs with details pages?`}
                    onCancel={() => this.setState({ showOpenAllDetailsDialog: false })}
                    confirmButtonStyle="primary"
                    confirmLabel="Yes"
                    onConfirm={this.handleOpenDetailsPages}
                />
                <EncounterOptionsModal
                    key={"encounter-option-modal-" + this.state.encounterOptions.show}
                    show={this.state.encounterOptions.show}
                    context={this.state.encounterOptions}
                    encounter={this.state.activeEncounter}
                    onHide={this.closeEncounterOptions}
                    onChange={this.reloadHandler(this.closeEncounterOptions)}
                    onOpenDetailsPages={this.openDetailsPagesDialog}
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
            <div id="bhroot" className={this.dialogOpenClass()} onContextMenu={(e) => e.preventDefault()}>
                <div className="Monster-encounter-menu">
                    <MenuButton className="btn" icon="glyphicon-file" title="New Encounter" onClick={() => this.setState({ showNewEncounterModal: true })} />
                    <MenuButton className="btn" icon="glyphicon-cog" title="Encounter Options" onClick={this.openEncounterOptions} />
                    <MenuButton className="btn" icon="glyphicon-wrench" title="Extension Options" onClick={LinkService.toNewTabHandler(`chrome-extension://${chrome.runtime.id}/optionspage.html`, true)} />
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