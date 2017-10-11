import React from 'react';
import ReactDOM from 'react-dom';
import AddMonsterButton from './AddMonsterButton';
import ParseData from "./ParseData";
import ParseService from "./ParseService";

const addButton = function(id: string, name: string, hp: string, target: JQuery<HTMLElement>){    
    const elementToPrepend = document.createElement("span");
    ReactDOM.render(<AddMonsterButton monsterdata={{ id, name, hp }} />, elementToPrepend);
    target.prepend(elementToPrepend);
}

const addButtons = function () {
    ParseService.parseMonsters().forEach(data => {
        const monster = data.monsterData;
        if(monster.diceHp){
            addButton(monster.id, monster.name, monster.diceHp, data.targetToPrepent);
        }
        addButton(monster.id, monster.name, monster.hp, data.targetToPrepent);
    });
}

chrome.runtime.onMessage.addListener(() => addButtons());
addButtons();