import './App.css';

import React, { Component } from 'react';

import BadgeService from './services/BadgeService';
import Link from './monsterbuttons/Link';
import MonsterData from './data/MonsterData';
import MonsterList from './MonsterList';
import MonsterListData from './data/MonsterListData';
import MonsterMenuButton from './monsterbuttons/MonsterMenuButton';
import MonsterMetadata from './data/MonsterMetadata';
import StorageService from './services/StorageService';
import { Well } from 'react-bootstrap';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lists: [],
            activeList: null
        };
        this.handleRemoveMonster = this.handleRemoveMonster.bind(this);
        this.buildList = this.buildList.bind(this);
        this.mainContent = this.mainContent.bind(this);
        StorageService.getMonsterLists().then(lists => {
            const activeList = lists.find(list => list.active);
            this.setState({ lists, activeList });
        }).catch(error => { throw error; });
    }

    handleRemoveMonster(toDeleteMonster: MonsterData) {
        const toDeleteId = toDeleteMonster.storageId;
        StorageService.deleteMonster(toDeleteMonster).then(() => {
            this.setState((prevState) => {
                prevState.activeList.metadatas.forEach((metadata, metaIndex) => {
                    metadata.monsters.forEach((monster, monsterIndex) => {
                        if (monster.storageId !== toDeleteId) return;
                        metadata.monsters.splice(monsterIndex, 1);
                        if (metadata.monsters.length === 0) prevState.activeList.metadatas.splice(metaIndex, 1);
                    });
                });
                return { activeList: prevState.activeList };
            });
            BadgeService.updateBadgeCount();
        });
    }

    buildList() {
        const list: MonsterListData = this.state.activeList;
        if (!list) return "";
        return list.metadatas.map((metadata, index) => {
            const id = metadata.monsterId;
            const last = list.metadatas.length - 1 === index;
            return (
                <li className={last ? "Monster-list-last" : ""} key={id}>
                    <MonsterList metadata={metadata} onRemoveMonster={this.handleRemoveMonster} />
                </li>
            );
        });
    }

    mainContent() {
        const list: MonsterListData = this.state.activeList;
        if (!list) return <span/>;
        if (list.metadatas && list.metadatas.length > 0) return <ul>{this.buildList()}</ul>;

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
                {/* <div style={{padding: "4px"}}>
                    <MonsterMenuButton icon="glyphicon-plus" title="Expand All"/>
                    <MonsterMenuButton icon="glyphicon-minus" title="Collapse All"/>
                </div> */}
                {this.mainContent()}
            </div>
        );
    }
}

export default App;
