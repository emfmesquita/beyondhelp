import React, { Component } from 'react';
import './App.css';
import MonsterList from './MonsterList';
import MonsterService from './services/MonsterService';
/* global chrome */

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      monsters: []
    }
    this.addMonster = this.addMonster.bind(this);
    this.handleRemoveMonster = this.handleRemoveMonster.bind(this);
    MonsterService.getMonstersFromStorage().then(monsters => this.setState({ monsters })).catch(error => { throw error });
  }

  addMonster(monster) {
    this.setState((prevState, props) => {
      prevState.monsters.push(monster);
      return { monsters: prevState.monsters };
    });
  }

  handleRemoveMonster(storageId) {    
    chrome.storage.sync.remove(storageId, (error) => {
      if (chrome.runtime.lastError) {
        throw chrome.runtime.lastError;
      }
      MonsterService.getMonstersFromStorage().then(monsters => this.setState({ monsters })).catch(error => { throw error });
    });
  }

  render() {
    return (
      <MonsterList monsters={this.state.monsters} onRemoveMonster={this.handleRemoveMonster} />
    );
  }
}

export default App;
