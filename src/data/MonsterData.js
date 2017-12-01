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

    get name() {
        return this.name;
    }

    set name(value: string) {
        this.name = value;
    }

    get color() {
        return this.color;
    }

    set color(value: string) {
        this.color = value;
    }

    get textColor() {
        return this.textColor;
    }

    set textColor(value: string) {
        this.textColor = textColor;
    }
}

export default MonsterData;