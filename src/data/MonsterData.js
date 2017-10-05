import DiceExp from "../services/DiceExp"

class MonsterData {
    /**
     * @param {string} storageId 
     * @param {string} monsterid 
     * @param {string} name 
     * @param {string} hp 
     */
    constructor(storageId, monsterid, name, hp) {
        this.storageId = storageId;
        this.monsterId = monsterid;
        this.name = name;
        this.hp = DiceExp.calcValue(hp);
        this.hp = this.hp > 0 ? this.hp : 1;
    }

    /**
     * @returns {number}
     */
    get number(){
        return this.number;
    }

    set number(value){
        this.number = value;
    }
}

export default MonsterData;