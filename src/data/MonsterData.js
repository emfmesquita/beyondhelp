import DiceExp from "../services/DiceExp"

class MonsterData {
    /**
     * @param {string} storageId 
     * @param {string} monsterId 
     * @param {string} name 
     * @param {string} hp 
     */
    constructor(storageId, monsterId, name, hp) {
        this.storageId = storageId;
        this.monsterId = monsterId;
        this.name = name;
        this.hp = DiceExp.calcValue(hp);
        this.hp = this.hp > 0 ? this.hp : 1;
        this.currentHp = this.hp;
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