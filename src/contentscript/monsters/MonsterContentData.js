class MonsterContentData {
    constructor(id: string, name: string, hp: string, diceHp: string, cr: string, addButton: boolean) {
        this.id = id;
        this.name = name;
        this.hp = hp;
        this.diceHp = diceHp;
        this.cr = cr;
        this.addButton = addButton;
    }
}

export default MonsterContentData;