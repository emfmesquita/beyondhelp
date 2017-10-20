import Data from "./Data";
import DiceExp from "../services/DiceExp";

class MonsterData extends Data {
    constructor(storageId: string, listId: string, hp: string, number: number) {
        super(storageId);
        this.listId = listId;
        this.hp = DiceExp.calcValue(hp);
        this.hp = this.hp > 0 ? this.hp : 1;
        this.currentHp = this.hp;
        this.number = number;
    }
}

export default MonsterData;