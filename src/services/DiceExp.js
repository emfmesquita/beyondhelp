
const diceExpRegex = /^(\s*(\+|-)?\s*(([0-9]{0,10}d[0-9]{1,10})|([0-9]{1,10}))\s*)(\s*(\+|-)\s*(([0-9]{0,10}d[0-9]{1,10})|([0-9]{1,10}))\s*)*$/i;

/**
 * Roll a dice.
 * @param {number} diceValue The number value of the dice.
 * @returns {number} The value of the dice roll.
 */
const rollDice = function (diceValue) {
    return Math.floor(Math.random() * diceValue + 1);
};

/**
 * Roll a number of dice and add the results.
 * @param {*} term 
 */
const rollAllDice = function (term: DiceTerm) {
    var total = 0;
    for (var i = 0; i < term.numberOfDice; i++) {
        total += rollDice(term.value);
    }
    return total;
};

class DiceTerm {
    constructor(termExpression: string) {
        this.isDice = termExpression.indexOf("d") !== -1;
        this.isValid = true;

        const safe = (value: number, max: number, min: number) => {
            if (value > max) {
                this.isValid = false;
                return max;
            }
            if (value < min) {
                this.isValid = false;
                return min;
            }
            return value;
        };

        if (!this.isDice) {
            this.value = safe(Number(termExpression), Math.MAX_SAFE_INTEGER, Math.MIN_SAFE_INTEGER);
            return;
        }

        const variableTokens = termExpression.split("d");
        this.numberOfDice = variableTokens[0].length === 0 ? 1 : safe(Number(variableTokens[0]), 10000, 0); // caps number of dices at 10k for performance reasons.
        this.value = safe(Number(variableTokens[1]), Math.MAX_SAFE_INTEGER, Math.MIN_SAFE_INTEGER);
    }

    roll() {
        if (this.value === 0) return 0;
        return this.isDice ? rollAllDice(this) : this.value;
    }

    min() {
        if (this.value === 0) return 0;
        return this.isDice ? this.numberOfDice : this.value;
    }

    max() {
        if (this.value === 0) return 0;
        return this.isDice ? this.numberOfDice * this.value : this.value;
    }
}

/**
 * Calcs a dice expression term.
 */
const calcTermValue = function (term: string, min: boolean, max: boolean) {
    const termObj = new DiceTerm(term);
    if (min) return termObj.min();
    if (max) return termObj.max();
    return termObj.roll();
};

/**
 * Calcs a dice expression value.
 */
const calcDiceExpValue = function (diceExp: string, min: boolean, max: boolean) {
    var spaceLessExp = diceExp.replace(/\s/g, "").toLowerCase();
    var value = 0;
    var token = "";
    var add = true;
    for (var i = 0; i < spaceLessExp.length; i++) {
        if (spaceLessExp[i] === "+" || spaceLessExp[i] === "-") {
            if (add) value += calcTermValue(token, min, max);
            else value -= calcTermValue(token, max, min); // notice max min inverted on subtraction

            add = spaceLessExp[i] === "+";
            token = "";
            continue;
        }
        token += spaceLessExp[i];
    }
    if (add) value += calcTermValue(token, min, max);
    else value -= calcTermValue(token, max, min); // notice max min inverted on subtraction

    return value;
};

/**
 * Calcs a dice expression value.
 * @param {*} diceExp 
 * @param {*} min Uses the min value for every dice.
 * @param {*} max Uses the max value for every dice.
 */
const baseBalcValue = function (diceExp: string, min: boolean, max: boolean) {
    let innerDiceExp = diceExp;
    if (typeof innerDiceExp !== "string") {
        throw new Error("Only strings are supported.");
    }
    innerDiceExp = innerDiceExp.trim();
    if (innerDiceExp === "") {
        throw new Error("Empty expression.");
    }
    if (innerDiceExp.startsWith("(") && innerDiceExp.endsWith(")")) {
        innerDiceExp = innerDiceExp.substring(1, innerDiceExp.length - 1);
    }
    if (!diceExpRegex.test(innerDiceExp)) {
        throw new Error(`The expression "${diceExp}" is not a valid expression.`);
    }
    return calcDiceExpValue(innerDiceExp, min, max);
};

const isValidDiceExpression = function (diceExp: string) {
    var spaceLessExp = diceExp.replace(/\s/g, "").toLowerCase();
    var token = "";
    for (var i = 0; i < spaceLessExp.length; i++) {
        if (spaceLessExp[i] === "+" || spaceLessExp[i] === "-") {
            if (!new DiceTerm(token).isValid) return false;
            token = "";
            continue;
        }
        token += spaceLessExp[i];
    }
    return new DiceTerm(token).isValid;
};

class DiceExp {

    static isDiceExp(diceExp: string) {
        if (!diceExp) return false;
        const trimmed = diceExp.trim();
        if (!diceExpRegex.test(trimmed)) return false;
        return isValidDiceExpression(trimmed);
    }

    /**
     * Calcs a dice expression value.
     */
    static calcValue(diceExp: string) {
        return baseBalcValue(diceExp);
    }

    /**
     * Calcs the min value of a dice expression.
     */
    static calcMinValue(diceExp: string) {
        return baseBalcValue(diceExp, true);
    }

    /**
     * Calcs the max value of a dice expression.
     */
    static calcMaxValue(diceExp: string) {
        return baseBalcValue(diceExp, false, true);
    }
}

export default DiceExp;