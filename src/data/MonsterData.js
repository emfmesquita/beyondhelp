import DiceExp from "../services/DiceExp";
import Data from "./Data";

class MonsterData extends Data {
    constructor(storageId: string, metadataId: string, hp: string, number: number) {
        super(storageId);
        this.metadataId = metadataId;
        this.hp = DiceExp.calcValue(hp);
        this.hp = this.hp > 0 ? this.hp : 1;
        this.currentHp = this.hp;
        this.number = number;
    }
}

export default MonsterData;