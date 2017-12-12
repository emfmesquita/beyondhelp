import './App.scss';

import React, { Component } from 'react';

import $ from "jquery";
import BadgeService from './services/BadgeService';
import C from "./Constants";
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
        StorageService.getConfig().then(config => {
            config.activeEncounterId = newActiveEncounter.storageId;
            return StorageService.updateData(config);
        }).then(() => {
            this.setState({ activeEncounter: newActiveEncounter }, BadgeService.updateBadgeCount);
        });
    }

    canDeleteEncounter = () => {
        return this.state.encounters && this.state.encounters.length > 1;
    }

    /**
     * Updates data or an array of data on storage and updates state.
     */
    update = (dataArray: Data | Data[], callback: Function): Promise => {
        return StorageService.updateData(dataArray).then(() => {
            BadgeService.updateBadgeCount();
        }).then(() => {
            callback();
            const encounters = this.state.encounters.sort((a, b) => a.name.localeCompare(b.name));
            this.setState({ activeEncounter: this.state.activeEncounter, encounters });
        }).catch((e) => { throw new Error(e); });
    }

    /**
     * Kills an array of monsters, saves and updates state.
     */
    killMonsters = (monsters: MonsterData[], callback: Function) => {
        monsters.forEach(monster => monster.currentHp = 0);
        this.update(monsters, callback);
    };

    /**
     * Full heal an array of monsters, saves and updates state.
     */
    fullHealMonsters = (monsters: MonsterData[], callback: Function) => {
        monsters.forEach(monster => monster.currentHp = monster.hp);
        this.update(monsters, callback);
    };

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

    /**
     * onClick of delete of monsters options
     */
    handleDeleteMonster = () => {
        const toDeleteMonster = this.state.monsterOptions.monster;
        const monsterEl = this.state.monsterOptions.monsterEl;
        this.closeMonsterOptions();
        $(monsterEl).fadeOut(400, () => {
            const toDeleteId = toDeleteMonster.storageId;
            MonsterStorageService.deleteMonster(toDeleteMonster).then(() => {
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

    handleFullHealMonster = () => {
        this.fullHealMonsters([this.state.monsterOptions.monster], () => this.closeMonsterOptions());
    }

    handleKillMonster = () => {
        this.killMonsters([this.state.monsterOptions.monster], () => this.closeMonsterOptions());
    }

    handleMonsterCustomizeSave = ({ name, color, textColor, hp }) => {
        const monster: MonsterData = this.state.monsterOptions.monster;
        monster.name = name;
        monster.color = color;
        monster.textColor = textColor;
        monster.hp = hp;
        if (monster.currentHp > hp) {
            monster.currentHp = hp;
        }
        this.update(monster, () => this.closeMonsterOptions());
    }
    //#endregion

    //#region list options
    handleListRightClick = (list: MonsterListData, listEl: HTMLElement) => {
        this.setState({ listOptions: { show: true, list, listEl } });
    }

    closeListOptions = () => {
        this.setState({ listOptions: { show: false, list: null, listEl: null } });
    }

    handleMoveList = (delta: number) => {
        const list: MonsterListData = this.state.listOptions.list;
        const encounter: MonsterEncounterData = this.state.activeEncounter;
        const idx = encounter.lists.indexOf(list);
        const newIdx = idx + delta;
        if (newIdx < 0 || newIdx >= encounter.lists.length) {
            this.closeListOptions();
            return;
        }
        const toSwapList = encounter.lists[newIdx];
        const tempOrder = list.order;
        list.order = toSwapList.order;
        toSwapList.order = tempOrder;
        encounter.lists[idx] = toSwapList;
        encounter.lists[newIdx] = list;
        this.update([list, toSwapList], () => this.closeListOptions());
    }

    handleMoveListUp = () => {
        this.handleMoveList(-1);
    }

    handleMoveListDown = () => {
        this.handleMoveList(1);
    }

    handleFullHealList = () => {
        this.fullHealMonsters(this.state.listOptions.list.monsters, () => this.closeListOptions());
    }

    handleKillList = () => {
        this.killMonsters(this.state.listOptions.list.monsters, () => this.closeListOptions());
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
        this.setState({ showDeleteListDialog: false });
        const toDeleteList: MonsterListData = this.state.listOptions.list;
        const listEl = this.state.listOptions.listEl;
        this.closeListOptions();
        $(listEl).fadeOut(400, () => {
            const toDeleteId = toDeleteList.storageId;
            MonsterListStorageService.deleteList(toDeleteList).then(() => {
                this.setState((prevState) => {
                    prevState.activeEncounter.lists.forEach((list, listIndex) => {
                        if (list.storageId !== toDeleteId) return;
                        prevState.activeEncounter.lists.splice(listIndex, 1);
                    });
                    return { activeEncounter: prevState.activeEncounter };
                });
                BadgeService.updateBadgeCount();
            });
        });
    }

    handleListCustomizeSave = ({ color, textColor, headerColor }) => {
        const list: MonsterData = this.state.listOptions.list;
        list.color = color;
        list.textColor = textColor;
        list.headerColor = headerColor;
        this.update(list, () => this.closeListOptions());
    }
    //#endregion

    //#region encounter options
    openEncounterOptions = () => {
        this.setState({ encounterOptions: { show: true, deleteEnabled: this.canDeleteEncounter() } });
    }

    closeCloseEncounterOptions = () => {
        this.setState({ encounterOptions: { show: false, deleteEnabled: false } });
    }

    updateEncounterHp = (encounter: MonsterEncounterData) => {
        this.setState({ activeEncounter: this.state.activeEncounter }, () => {
            StorageService.updateData(list.monsters).then(() => {
                BadgeService.updateBadgeCount();
            }).catch((e) => { throw new Error(e); });
            this.closeListOptions();
        });
    }

    handleFullHealEncounter = () => {
        const encounter: MonsterEncounterData = this.state.activeEncounter;
        let monsters = [];
        encounter.lists.forEach(list => monsters = monsters.concat(list.monsters));
        this.fullHealMonsters(monsters, () => this.closeCloseEncounterOptions());
    }

    handleKillEncounter = () => {
        const encounter: MonsterEncounterData = this.state.activeEncounter;
        let monsters = [];
        encounter.lists.forEach(list => monsters = monsters.concat(list.monsters));
        this.killMonsters(monsters, () => this.closeCloseEncounterOptions());
    }

    handleColapseEncounter = () => {
        const encounter: MonsterEncounterData = this.state.activeEncounter;
        encounter.lists.forEach(list => list.collapsed = true);
        this.update(encounter.lists, () => this.closeCloseEncounterOptions());
    }

    handleExpandEncounter = () => {
        const encounter: MonsterEncounterData = this.state.activeEncounter;
        encounter.lists.forEach(list => list.collapsed = false);
        this.update(encounter.lists, () => this.closeCloseEncounterOptions());
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

    handleEncounterCustomizeSave = ({ name, color, textColor }) => {
        const encounter: MonsterEncounterData = this.state.activeEncounter;
        encounter.name = name;
        encounter.color = color;
        encounter.textColor = textColor;
        this.update(encounter, () => this.closeCloseEncounterOptions());
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
                    onHide={this.closeCloseEncounterOptions}
                    onDelete={this.openDeleteEncounterDialog}
                    onFullHeal={this.handleFullHealEncounter}
                    onKill={this.handleKillEncounter}
                    onCollapse={this.handleColapseEncounter}
                    onExpand={this.handleExpandEncounter}
                    onCustomizeSave={this.handleEncounterCustomizeSave}
                />
                <ListOptionsModal
                    key={"list-option-modal-" + this.state.listOptions.show}
                    show={this.state.listOptions.show}
                    context={this.state.listOptions}
                    encounter={this.state.activeEncounter}
                    onHide={this.closeListOptions}
                    onDelete={this.openDeleteListDialog}
                    onUp={this.handleMoveListUp}
                    onDown={this.handleMoveListDown}
                    onFullHeal={this.handleFullHealList}
                    onKill={this.handleKillList}
                    onCustomizeSave={this.handleListCustomizeSave}
                />
                <MonsterOptionsModal
                    key={"monster-option-modal-" + this.state.monsterOptions.show}
                    show={this.state.monsterOptions.show}
                    context={this.state.monsterOptions}
                    encounter={this.state.activeEncounter}
                    onHide={this.closeMonsterOptions}
                    onDelete={this.handleDeleteMonster}
                    onFullHeal={this.handleFullHealMonster}
                    onKill={this.handleKillMonster}
                    onCustomizeSave={this.handleMonsterCustomizeSave}
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