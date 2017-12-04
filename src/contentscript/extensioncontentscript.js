import AddMonsterButton from './AddMonsterButton';
import FavIconService from "./FavIconService";
import ParseData from "./ParseData";
import ParseService from "./ParseService";
import React from 'react';
import ReactDOM from 'react-dom';
import TableRollService from "./tableroll/TableRollService";

const createButton = function (id: string, name: string, hp: string) {
    const buttonSpan = document.createElement("span");
    ReactDOM.render(<AddMonsterButton monsterdata={{ id, name, hp }} />, buttonSpan);
    return buttonSpan;
};

const init = function () {
    // render the add monster buttons
    ParseService.parseMonsters().forEach(data => {
        const buttonsDiv = document.createElement("div");
        const monster = data.monsterData;
        buttonsDiv.appendChild(createButton(monster.id, monster.name, monster.hp, data.insert));
        buttonsDiv.appendChild(createButton(monster.id, monster.name, monster.diceHp, data.insert));
        data.insert(buttonsDiv);
    });
    // inits the table rollers
    TableRollService.init();
};

chrome.runtime.onMessage.addListener(() => init());
init();

// change fav icon of char page
FavIconService.changeFavIcon();