import React from 'react';
import ReactDOM from 'react-dom';
import AddMonsterButton from './AddMonsterButton';
import ParseData from "./ParseData";
import ParseService from "./ParseService";

const createButton = function (id: string, name: string, hp: string) {
    const buttonSpan = document.createElement("span");
    ReactDOM.render(<AddMonsterButton monsterdata={{ id, name, hp }} />, buttonSpan);
    return buttonSpan;
};

const addButtons = function () {
    ParseService.parseMonsters().forEach(data => {
        const buttonsDiv = document.createElement("div");
        const monster = data.monsterData;
        buttonsDiv.appendChild(createButton(monster.id, monster.name, monster.hp, data.insert));
        buttonsDiv.appendChild(createButton(monster.id, monster.name, monster.diceHp, data.insert));
        data.insert(buttonsDiv);
    });
};

chrome.runtime.onMessage.addListener(() => addButtons());
addButtons();