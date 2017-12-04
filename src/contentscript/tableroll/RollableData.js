class RollableData {
    constructor(text: string, diceValue: string, valuedColumns: Array<number>, renderTarget: HTMLElement) {
        this.text = text;
        this.diceValue = diceValue;
        this.valuedColumns = valuedColumns;
        this.renderTarget = renderTarget;
    }
}

export default RollableData;