import MonsterContentData from "./MonsterContentData";

class MonsterParseData {
    constructor(insertButtonFunction: string, statBlock: JQuery<HTMLElement>, monsterData: MonsterContentData) {
        this.statBlock = statBlock;
        this.insertButton = statBlock[insertButtonFunction].bind(statBlock);
        this.monsterData = monsterData;
    }
}

export default MonsterParseData;