import MonsterContentData from "./MonsterContentData"

class ParseData {
    constructor(targetToPrepent: JQuery<HTMLElement>, monsterData: MonsterContentData){
        this.targetToPrepent = targetToPrepent;
        this.monsterData = monsterData;
    }
}

export default ParseData;