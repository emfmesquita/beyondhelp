import MonsterContentData from "./MonsterContentData"

class ParseData {
    constructor(insertFunction: string, target: JQuery<HTMLElement>, monsterData: MonsterContentData) {
        this.insert = target[insertFunction].bind(target);
        this.monsterData = monsterData;
    }
}

export default ParseData;