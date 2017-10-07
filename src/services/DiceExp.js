
const diceExpRegex = /^(\s*(\+|-)?\s*(([0-9]{0,10}d[0-9]{1,10})|([0-9]{1,10}))\s*)(\s*(\+|-)\s*(([0-9]{0,10}d[0-9]{1,10})|([0-9]{1,10}))\s*)*$/i;

/**
 * Calcs a dice expression term.
 */
const calcTermValue = function (term: string) {
    var isVariable = term.indexOf("d") !== -1;
    if (!isVariable) return Number(term);

    var variableTokens = term.split("d");
    var multiplier = variableTokens[0].length === 0 ? 1 : Number(variableTokens[0]);
    var diceValue = Number(variableTokens[1]);

    var termValue = 0;
    if (diceValue > 0) {
        for (var i = 0; i < multiplier; i++) {
            var parcialValue = Math.floor((Math.random() * diceValue) + 1);
            termValue += parcialValue;
        }
    }

    return termValue;
}

/**
 * Calcs a dice expression value.
 */
const calcDiceExpValue = function (diceExp: string) {
    var spaceLessExp = diceExp.replace(/\s/g, "");
    var value = 0;
    var token = "";
    var add = true;
    for (var i = 0; i < spaceLessExp.length; i++) {
        if (spaceLessExp[i] === "+" || spaceLessExp[i] === "-") {
            if (add) value += calcTermValue(token);
            else value -= calcTermValue(token);

            add = spaceLessExp[i] === "+";
            token = "";
            continue;
        }
        token += spaceLessExp[i];
    }
    if (add) value += calcTermValue(token);
    else value -= calcTermValue(token);

    return value;
}

class DiceExp {

    /**
     * Calcs a dice expression value.
     */
    static calcValue(diceExp: string) {
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
        return calcDiceExpValue(innerDiceExp);
    }
}

export default DiceExp;