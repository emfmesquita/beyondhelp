import React, { Component } from 'react';
import './App.css';
import MonsterList from './MonsterList';
import MonsterData from './data/MonsterData';
import StorageService from './services/StorageService';
/* global chrome */

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      /**
       * @type {MonsterData[]}
       */
      monsters: []
    }
    this.addMonster = this.addMonster.bind(this);
    this.handleRemoveMonster = this.handleRemoveMonster.bind(this);
    StorageService.getMonstersFromStorage().then(monsters => this.setState({ monsters })).catch(error => { throw error });
  }

  addMonster(monster: MonsterData) {
    this.setState((prevState, props) => {
      prevState.monsters.push(monster);
      return { monsters: prevState.monsters };
    });
  }

  handleRemoveMonster(storageId: string) {
    chrome.storage.sync.remove(storageId, (error) => {
      if (chrome.runtime.lastError) {
        throw chrome.runtime.lastError;
      }
      StorageService.getMonstersFromStorage().then(monsters => this.setState({ monsters })).catch(error => { throw error });
    });
  }

  render() {
    return (
      <MonsterList monsters={this.state.monsters} onRemoveMonster={this.handleRemoveMonster} />
    );
  }
}

export default App;
