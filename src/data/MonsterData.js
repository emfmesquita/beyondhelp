import DiceExp from "../services/DiceExp"

class MonsterData {
    constructor(storageId: string, monsterId: string, name: string, hp: string) {
        this.storageId = storageId;
        this.monsterId = monsterId;
        this.name = name;
        this.hp = DiceExp.calcValue(hp);
        this.hp = this.hp > 0 ? this.hp : 1;
        this.currentHp = this.hp;
    }

    get number() {
        return this.number;
    }

    set number(value: number) {
        this.number = value;
    }
}

export default MonsterData;