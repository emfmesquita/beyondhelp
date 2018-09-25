import AddMonsterButton from "./AddMonsterButton";
import Configuration from "../../data/Configuration";
import MonsterCRIndicator from "./MonsterCRIndicator";
import MonsterParseData from "./MonsterParseData";
import MonsterParseService from "./MonsterParseService";
import Opt from "../../Options";
import React from 'react';
import ReactDOM from 'react-dom';

const createButton = (config: Configuration, id: string, name: string, hp: string) => {
    const buttonSpan = document.createElement("span");
    ReactDOM.render(<AddMonsterButton monsterdata={{ id, name, hp }} config={config} />, buttonSpan);
    return buttonSpan;
};

const addButton = (config: Configuration, data: MonsterParseService) => {
    const monster = data.monsterData;
    if (!monster.addButton) return;

    const buttonsDiv = document.createElement("div");
    buttonsDiv.appendChild(createButton(config, monster.id, monster.name, monster.hp));
    buttonsDiv.appendChild(createButton(config, monster.id, monster.name, monster.diceHp));
    data.insertButton(buttonsDiv);
};

const addCrIndicator = (config: Configuration, data: MonsterParseData) => {
    if (!config[Opt.MonsterCRIndicator]) return;

    const monster = data.monsterData;

    const crDiv = document.createElement("div");
    data.statBlock.append(crDiv);
    ReactDOM.render(<MonsterCRIndicator cr={monster.cr} />, crDiv);
};

class MonstersService {
    static init(config: Configuration) {
        MonsterParseService.parseMonsters(config).forEach(data => {
            addButton(config, data);
            addCrIndicator(config, data);
        });
    }
}

export default MonstersService;