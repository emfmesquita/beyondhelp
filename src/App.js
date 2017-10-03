import React, { Component } from 'react';
import './App.css';
import MonsterList from './MonsterList';

const monsters = [
  {
    id: "aboleth",
    name: "Aboleth",
    number: 1,
    hp: 100
  }, {
    name: "Dragon",
    number: 2,
    hp: 200
  }, {
    name: "Druid",
    number: 1,
    hp: 45
  }, {
    name: "Druid",
    number: 2,
    hp: 45
  }, {
    name: "Druid",
    number: 3,
    hp: 45
  }, {
    name: "Druid",
    number: 4,
    hp: 45
  }, {
    name: "Druid",
    number: 5,
    hp: 45
  }, {
    name: "Druid",
    number: 6,
    hp: 45
  }
];

class App extends Component {
  render() {
    return (
      <MonsterList monsters={monsters} />
    );
  }
}

export default App;
