class RollableData {
    constructor(text: string, diceValue: string, valuedColumns: number[], renderTarget: HTMLElement) {
        if (text) {
            text = text.trim();
            text = text.split("").join('\u0000');
        }
        this.text = text;
        this.diceValue = diceValue;
        this.valuedColumns = valuedColumns;
        this.renderTarget = renderTarget;
    }
}

export default RollableData;