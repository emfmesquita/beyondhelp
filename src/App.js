import React, { Component } from 'react';
import './App.css';
import MonsterList from './MonsterList';

// const monsters = [
//   {
//     id: "aboleth",
//     name: "Aboleth",
//     number: 1,
//     hp: 100
//   }, {
//     name: "Dragon",
//     number: 2,
//     hp: 200
//   }, {
//     name: "Druid",
//     number: 1,
//     hp: 45
//   }, {
//     name: "Druid",
//     number: 2,
//     hp: 45
//   }, {
//     name: "Druid",
//     number: 3,
//     hp: 45
//   }, {
//     name: "Druid",
//     number: 4,
//     hp: 45
//   }, {
//     name: "Druid",
//     number: 5,
//     hp: 45
//   }, {
//     name: "Druid",
//     number: 6,
//     hp: 45
//   }
// ];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      monsters: []
    }
    this.addMonster = this.addMonster.bind(this);

    /* global chrome */
    chrome.storage.sync.get(null, (storageData) => {
      const monsters = [];
      Object.keys(storageData).map((keyName, keyIndex) => {
        if (keyName && keyName.startsWith("bh-monster-")) {
          monsters.push(storageData[keyName]);
        }
      });
      this.setState({ monsters });
    });
  }

  addMonster(monster) {
    this.setState((prevState, props) => {
      prevState.monsters.push(monster);
      return { monsters: prevState.monsters };
    });
  }

  render() {
    return (
      <MonsterList monsters={this.state.monsters} />
    );
  }
}

export default App;
