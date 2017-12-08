import $ from "jquery";
import AddMonsterButton from './addmonsters/AddMonsterButton';
import FavIconService from "./FavIconService";
import MonsterParseData from "./addmonsters/MonsterParseData";
import MonsterParseService from "./addmonsters/MonsterParseService";
import MyCharactersService from "./mycharacters/MyCharactersService";
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
    MonsterParseService.parseMonsters().forEach(data => {
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

// change my characters page
MyCharactersService.init();