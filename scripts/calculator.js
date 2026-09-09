// ============================================================================
// Tokens
// ============================================================================

import { parse } from "./parser.js";
import { evaluate } from "./evaluator.js";

class Token {
    constructor(type, value) {
        this.type = type;
        this.value = value;
    }
}

// ============================================================================
// CALCULATOR STATE
// ============================================================================

export class CalculatorState {
    #tokens;
    #currentInput;
    #currentResult;
    #displayIsResult;
    #isErrorMode;
    #pendingOperator;
    #lastOperation;
    #expression;
    #subExpression;
    #customExpression;
    #subResult;
    #memory;
    #history;

    constructor() {
        // The AST is built from these tokens when required.
        this.#tokens = [],

        // Number currently being entered.
        this.#currentInput = "0",

        // Current result
        this.#currentResult = null,
        this.#displayIsResult = false,
        this.#isErrorMode = false,

        // Operator waiting for the next operand.
        this.#pendingOperator = {
            token: null,
            index: 0,
        },

        // Used by repeated equals.
        this.#lastOperation = [],

        // Current expression tree.
        this.#expression = null,

        // Current sub-expression tree.
        this.#subExpression = null,

        // Current custom expression tree
        this.#customExpression = null,

        // current sub-expression result.
        this.#subResult = null,

        // Memory stack.
        this.#memory = [],

        // History entries.
        this.#history = []
    }

    // ============================
    // private internal functions

    // token

    #appendToken(token) {
        this.#tokens.push(token);
    }

    #prependToken(token) {
        this.#setPendingOperator(
            this.#pendingOperator.token,
            this.#pendingOperator.index + 1
        );

        this.#tokens.unshift(token);
    }

    #insertToken(token, index) {
        if (index <= this.#pendingOperator.index) {
            this.#setPendingOperator(
                this.#pendingOperator.token,
                this.#pendingOperator.index + 1
            );
        }

        this.#tokens.splice(index, 0, token);
    }

    #insertMultipleTokens(tokens, indices) {
        for (let i = tokens.length - 1; i >= 0; i--) {
            if (indices[i] <= this.#pendingOperator.index) {
                this.#setPendingOperator(
                    this.#pendingOperator.token,
                    this.#pendingOperator.index + 1
                );
            }

            this.#tokens.splice(indices[i], 0, tokens[i]);
        }
    }

    #removeLastToken() {
        this.#tokens.pop();
    }

    #removeMultipleSequentialTokens(startIdx, endIdx = null) {
        if (endIdx === null) {
            this.#tokens.splice(startIdx);
        } else {
            this.#tokens.splice(startIdx, endIdx - startIdx + 1);
        }
    }

    #appendCurrentInput() {
        let input = this.#currentInput;
        let negativeToken = null;

        if (input[0] === "-") {
            input = this.#currentInput.slice(1);
            negativeToken = new Token("operator", "-");
        }

        const value = parseFloat(input);

        if (Number.isNaN(value)) {
            return;
        }

        if (negativeToken !== null) this.#appendToken(negativeToken);

        this.#appendToken(new Token("number", value));
    }

    #prependCurrentInput() {
        let input = this.#currentInput;
        let negativeToken = null;

        if (input[0] === "-") {
            input = this.#currentInput.slice(1);
            negativeToken = new Token("operator", "-");
        }

        const value = parseFloat(input);

        if (Number.isNaN(value)) {
            return;
        }

        this.#prependToken(new Token("number", value));

        if (negativeToken !== null) this.#prependToken(negativeToken);
    }

    #processTokens() {
        this.#buildExpressionTree();
        
        const result = this.#attemptEvaluate();
        if (result !== null) return result;
        
        return this.#currentInput;
    }

    #insertFunction(value) {
        const lastToken = this.getLastToken();
        if (lastToken && lastToken.type === "enter") {
            const prevResult = this.getResult();
            this.#resetAllInputState();
            this.#replaceCurrentInput(prevResult);
        }

        const subExpressionStart = this.#findCurrentSubExpressionStart();

        if (subExpressionStart !== null && this.#tokens[subExpressionStart].type === "leftParen") {
            this.#insertToken(new Token("function", value), subExpressionStart);
        } else if (subExpressionStart !== null && this.#tokens[subExpressionStart].type === "function") {
            this.#insertMultipleTokens(
                [ 
                    new Token("function", value),
                    new Token("leftParen", "("),
                    new Token("rightParen", ")")
                ],
                [ 
                    subExpressionStart,
                    subExpressionStart,
                    this.#tokens.length
                ]
            );
        }else {
            this.#appendToken(new Token("function", value));
            this.#appendToken(new Token("leftParen", "("));
            this.#appendCurrentInput();
            this.#appendToken(new Token("rightParen", ")"));
        }
    }

    #paranthesizeSubExpression(operatorIdx) {
        if (this.#tokens.length < 1) return -1;

        const currentToken = this.#tokens[operatorIdx];
        if (!currentToken || currentToken.type !== "operator") return -1;

        let rightParenIdx = operatorIdx;
        if (rightParenIdx === 0) return -1;

        this.#insertToken(new Token("rightParen", ")"), rightParenIdx);
        this.#prependToken(new Token("leftParen", "("));
        rightParenIdx++;

        return rightParenIdx;
    }

    // expression

    #attemptParse() {
        try {
            const expressionTree = parse(this.#tokens);
            return expressionTree;
        } catch (error) {
            console.warn(error);
            return null;
        }
    }

    #attemptEvaluate() {
        if (!this.#expression) return null;

        try {
            const result = evaluate(this.#expression);
            this.#clearExpression();
            return result;
        } catch (error) {
            console.warn(error);
            this.#clearExpression();
            return null;
        }
    }

    #buildExpressionTree() {
        if (this.#tokens.length < 1) return false;
        const expression = this.#attemptParse();

        if (expression === null) return false;

        this.#expression = expression;
        return true;
    }

    // current sub expression

    #attemptParseSubExpression(start) {
        if (
            this.#tokens.length < 1 ||
            start < 0 ||
            this.#tokens.length - 1 < start
        ) {
            return null;
        }

        const subExpressionTokens = this.#tokens.slice(start);

        try {
            const expressionTree = parse(subExpressionTokens);
            return expressionTree;
        } catch (error) {
            console.warn(error);
            return null;
        }
    }

    #attemptEvaluateSubExpression() {
        if (!this.#subExpression) return null;

        try {
            const result = evaluate(this.#subExpression);
            this.#clearSubExpression();
            return result;
        } catch (error) {
            console.warn(error);
            this.#clearSubExpression();
            return null;
        }
    }

    #buildSubExpressionTree() {
        if (this.#tokens.length < 1) return false;
        
        const start = this.#findCurrentSubExpressionStart();
        if (start === null) return false;

        const expression = this.#attemptParseSubExpression(start);

        if (expression === null) return false;

        this.#subExpression = expression;
        return true;
    }

    #findCurrentSubExpressionStart() {
        const lastToken = this.getLastToken();
        if (lastToken && lastToken.type !== "rightParen") return null;

        let depth = 0;

        for (let i = this.#tokens.length - 1; i >= 0; i--) {
            const token = this.#tokens[i];

            if (token.type === "rightParen") {
                depth++;
            }

            if (token.type === "leftParen") {
                depth--;

                if (depth === 0 && i === 0) {
                    return 0;
                } else if (depth === 0 && i !== 0) {
                    if (this.#tokens[i - 1].type === "function") return i - 1;

                    return i;
                }
            }
        }

        return null;
    }

    // any sub expression

    #attemptParseAnySubExpression(start, rightParenIdx) {
        if (
            this.#tokens.length < 1 ||
            start < 0 ||
            this.#tokens.length - 1 < start ||
            rightParenIdx <= 1 ||
            this.#tokens[rightParenIdx].type !== "rightParen"
        ) {
            return null;
        }

        const subExpressionTokens = this.#tokens.slice(start, rightParenIdx + 1);

        try {
            const expressionTree = parse(subExpressionTokens);
            return expressionTree;
        } catch (error) {
            console.warn(error);
            return null;
        }
    }

    #buildAnySubExpressionTree(rightParenIdx) {
        if (!rightParenIdx || rightParenIdx <= 0 || this.#tokens.length < 1) return false;
        
        const start = this.#findAnySubExpressionStart(rightParenIdx);
        if (start === null) return false;

        const expression = this.#attemptParseAnySubExpression(start, rightParenIdx);
        if (expression === null) return false;

        this.#subExpression = expression;
        return true;
    }

    #findAnySubExpressionStart(rightParenIdx) {
        const rightParenToken = this.#tokens[rightParenIdx];
        if (rightParenToken && rightParenToken.type !== "rightParen") return null;

        let depth = 0;

        for (let i = rightParenIdx; i >= 0; i--) {
            const token = this.#tokens[i];

            if (token.type === "rightParen") {
                depth++;
            }

            if (token.type === "leftParen") {
                depth--;

                if (depth === 0 && i === 0) {
                    return 0;
                } else if (depth === 0 && i !== 0) {
                    if (this.#tokens[i - 1].type === "function") return i - 1;

                    return i;
                }
            }
        }

        return null;
    }

    // custom expression

    #attemptParseCustomExpression(tokens) {
        if (!tokens || tokens.length <= 1) return null;

        try {
            const expressionTree = parse(tokens);
            return expressionTree;
        } catch (error) {
            console.warn(error);
            return null;
        }
    }

    #attemptEvaluateCustomExpression() {
        if (!this.#customExpression) return null;

        try {
            const result = evaluate(this.#customExpression);
            this.#clearCustomExpression();
            return result;
        } catch (error) {
            console.warn(error);
            this.#clearCustomExpression();
            return null;
        }
    }

    #buildPercentExpression(leftOperand, rightOperand) {
        if (!leftOperand || !rightOperand) return false;

        const leftOperandToken = new Token("number", leftOperand);
        const multiplyToken = new Token("operator", "*");
        const rightOperandToken = new Token("number", rightOperand);
        const divideToken = new Token("operator", "/");
        const num100Token = new Token("number", 100);

        const tokens = [
            leftOperandToken,
            multiplyToken,
            rightOperandToken,
            divideToken,
            num100Token
        ];

        const expression = this.#attemptParseCustomExpression(tokens);
        if (expression === null) return false;

        this.#customExpression = expression;
        return true;
    }

    // input

    #resetAllInputState() {
        this.#tokens.splice(0);
        this.#currentInput = "0";
        this.#currentResult = null;
        this.#displayIsResult = false;
        this.#isErrorMode = false;
        this.#pendingOperator = {
            token: null,
            index: 0,
        },
        this.#lastOperation.splice(0);
        this.#expression = null;
        this.#subExpression = null;
        this.#customExpression = null;
        this.#subResult = null;
    }

    #setPendingOperator(token, idx) {
        const builtOp = {
            token: token,
            index: idx,
        };

        this.#pendingOperator = builtOp;
    }

    #cleanupResults() {
        this.#clearCurrentResult();
        this.#clearExpression();
        this.#clearSubExpression();
        this.#clearCustomExpression();
        this.#clearSubResult();
    }

    #clearCurrentResult() {
        this.#currentResult = null;
    }

    #clearExpression() {
        this.#expression = null;
    }

    #clearSubExpression() {
        this.#subExpression = null;
    }

    #clearCustomExpression() {
        this.#customExpression = null;
    }

    #clearSubResult() {
        this.#subResult = null;
    }

    #clearLastOperation() {
        this.#lastOperation.splice(0);
    }

    #replaceCurrentInput(value) {
        let newInput = String(value);
        if (newInput.length)

        this.#currentInput = String(value);
        this.#displayIsResult = false;
    }

    #appendToCurrentInput(value) {
        if (this.#currentInput.length > 15) return;
        this.#currentInput = this.#currentInput + String(value);
    }

    #prependToCurrentInput(value) {
        this.#currentInput = String(value) + this.#currentInput;
    }

    #removePrefixFromCurrentInput() {
        this.#currentInput = this.#currentInput.slice(1);
    }

    #revertCurrentInput() {
        if (this.#currentInput.length == 1) {
            this.#currentInput = "0";
        } else {
            this.#currentInput = this.#currentInput.substring(0, this.#currentInput.length - 1);
        }
    }

    // commit

    #commitCurrentResult(result) {
        this.#currentResult = result;
    }

    #commitSubResultToCurrentInput(result) {
        if (!this.isValidResult(result)) {
            this.#isErrorMode = true;
        }

        this.#subResult = result;
        this.#currentInput = String(result);
        this.#displayIsResult = true;
    }

    #commitResultToCurrentInput(result) {
        if (!this.isValidResult(result)) {
            this.#isErrorMode = true;
        }

        this.#currentInput = String(result);
        this.#displayIsResult = true;
    }

    #commitLastOperation() {
        if (this.#tokens.length < 1) return;
        this.#clearLastOperation();
        let lastOperationTokens = [];

        const operatorPointer = this.getPendingOperator();
        // const start = this.#findAnySubExpressionStart(this.#tokens.length - 1);
        if (operatorPointer.token) {
            lastOperationTokens = this.#tokens.slice(operatorPointer.index);
        } 
        // else if (start !== null) {
        //     lastOperationTokens = this.#tokens.slice(start);
        // } else {
        //     lastOperationTokens = this.#tokens.slice(this.#tokens.length - 1);
        // }
        // const lastOperationTokens = this.#tokens.slice(operatorPointer.index);

        for (let i = 0; i < lastOperationTokens.length; i++) {
            this.#lastOperation.push(lastOperationTokens[i]);
        }
    }

    // presentation

    #formatSciNotation(input) {
        if (!input) return;
        
        const formattedInput = Number(input).toExponential(12);
        return String(formattedInput);
    }

    #formatDecimal(input) {
        if (!input || typeof input !== 'string') return;

        const decimalIdx = input.indexOf(".");

        const integer = (decimalIdx === -1 ? input : input.slice(0, decimalIdx));
        const decimal = (decimalIdx === -1 ? "" : input.slice(decimalIdx));

        return integer.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + decimal;
    }

    // ============================
    // public interface functions

    // access functions

    getTokens() {
        return this.#tokens;
    }

    getExpressionTokens() {
        const tokens = [];
        for (let i = 0; i < this.#tokens.length; i++) {
            const token = this.#tokens[i];
            const value = String(token.value);

            if (token.type === "number") {
                const decimalIdx = value.indexOf(".");
                const integer = (decimalIdx === -1 ? value : value.slice(0, decimalIdx));

                if (integer.length > 16) {
                    tokens.push(this.#formatSciNotation(value));
                } else {
                    tokens.push(value);
                }
            } else {
                tokens.push(value);
            }
        }
        return tokens;
    }

    getLastToken() {
        if (this.#tokens.length < 1) return null;

        return this.#tokens[this.#tokens.length - 1];
    }

    getResult() {
        return this.#currentResult;
    }

    getPendingOperator() {
        return this.#pendingOperator;
    }

    getLastOperation() {
        return this.#lastOperation;
    }

    getExpression() {
        return this.#expression;
    }

    getHistory() {
        return this.#history;
    }

    getMemory() {
        return this.#memory;
    }

    getErrorMode() {
        return this.#isErrorMode;
    }

    getCurrentInputDisplay() {
        let input = this.#currentInput;
        if (!input || typeof input !== 'string') return;

        const decimalIdx = input.indexOf(".");
        const integer = (decimalIdx === -1 ? input : input.slice(0, decimalIdx));

        if (integer.length > 16) {
            input = this.#formatSciNotation(input);
        } else {
            input = this.#formatDecimal(input);
        }

        return input;
    }

    // operational functions

    operatorSelection(value) {
        if (!value) return;
        
        const token = new Token("operator", value);

        if (this.#displayIsResult) {
            const lastToken = this.getLastToken();
            if (lastToken && lastToken.type === "operator") {
                if (
                    this.#tokens[this.#tokens.length - 2].type !== "rightParen" &&
                    (token.value === "*" || token.value === "/")
                ) {
                    const pendingOperator = this.getPendingOperator();
                    if (pendingOperator) {
                        this.#paranthesizeSubExpression(pendingOperator.index);
                    }
                }

                this.#removeLastToken();
            }
            if (lastToken && lastToken.type === "enter") {
                const input = this.#currentInput;
                this.clear();
                this.#replaceCurrentInput(input);
                this.#appendCurrentInput();
                this.#commitResultToCurrentInput(
                    this.#processTokens()
                );
            }
            if (this.#currentInput === String(this.#subResult)) {
                this.#commitResultToCurrentInput(
                    this.#processTokens()
                );
            }
        } else {
            this.#appendCurrentInput();
            this.#commitResultToCurrentInput(
                this.#processTokens()
            );
        }

        this.#appendToken(token);
        this.#setPendingOperator(token, this.#tokens.length - 1);
    }

    injectNumber(value) {
        if (this.#isErrorMode) {
            this.#resetAllInputState();
        }

        if (!value) return;

        const lastToken = this.getLastToken();
        if (lastToken && lastToken.type === "enter") { 
            this.clear();

            this.#replaceCurrentInput(value);
        } else if (this.#currentInput === String(this.#subResult)) {
            this.clearEach();

            this.#replaceCurrentInput(value);
        } else if (this.#currentInput === "0" || this.#displayIsResult) {
            this.#replaceCurrentInput(value);
        } else {
            this.#appendToCurrentInput(value);
        }
    }

    clearEach() {
        if (this.#isErrorMode) {
            this.#resetAllInputState();
            return;
        }

        this.#replaceCurrentInput("0");

        const subExpressionStart = this.#findCurrentSubExpressionStart();
        const pendingOperator = this.getPendingOperator();
        if (subExpressionStart !== null ) {
            this.#removeMultipleSequentialTokens(subExpressionStart, this.#tokens.length);
        } else if (pendingOperator.token && pendingOperator.index !== this.#tokens.length - 1) {
            this.#removeMultipleSequentialTokens(pendingOperator.index + 1, this.#tokens.length);
        }
    }

    clear() {
        this.#resetAllInputState();
    }

    backspace() {
        if (this.#isErrorMode) {
            this.#resetAllInputState();
            return;
        }

        if (this.#displayIsResult) return;

        this.#revertCurrentInput();
    }

    addDecimal() {
        if (this.#currentInput.includes(".")) return;

        this.#appendToCurrentInput(".");
    }

    toggleInverse() {
        if (this.#currentInput === "0") return;

        if (this.#displayIsResult) {
            this.#insertFunction("negate");
            this.#buildSubExpressionTree();

            const result = this.#attemptEvaluateSubExpression();
            if (result !== null) {
                this.#commitSubResultToCurrentInput(result);
            }
        } else {
            if (!this.#currentInput.includes("-")) {
                this.#prependToCurrentInput("-");
            } else {
                this.#removePrefixFromCurrentInput();
            }
        }
    }

    sqrt() {
        this.#insertFunction("sqrt");
        this.#buildSubExpressionTree();

        const result = this.#attemptEvaluateSubExpression();
        if (result !== null) {
            this.#commitSubResultToCurrentInput(result);
        }
    }

    sqr() {
        this.#insertFunction("sqr");
        this.#buildSubExpressionTree();

        const result = this.#attemptEvaluateSubExpression();
        if (result !== null) {
            this.#commitSubResultToCurrentInput(result);
        }
    }

    oneDividedByX() {
        this.#insertFunction("1/");
        this.#buildSubExpressionTree();

        const result = this.#attemptEvaluateSubExpression();
        if (result !== null) {
            this.#commitSubResultToCurrentInput(result);
        }
    }

    /* 
        When the user enters an operand (value or expression that resolves to a value), 
        an operator, 
        a second operand,
        and then the percent key,
        the first operand is parenthesized,
        both operands are multiplied and the product divided by 100, 
        and that result replaces the second value.
    */
    percent() {
        if (this.#tokens.length === 0) this.clear();
        
        const lastToken = this.getLastToken();
        if (lastToken && lastToken.type !== "operator") {
            this.clear();
        }

        const pendingOperator = this.getPendingOperator();
        if (!pendingOperator.token) return;

        if (
            this.#tokens[pendingOperator.index - 1].type !== "rightParen" ||
            (
                this.#tokens[pendingOperator.index - 1].type === "rightParen" && 
                this.#findAnySubExpressionStart(pendingOperator.index - 1) !== 0
            )
        ) {
            const endOfLeftSideExpression = this.#paranthesizeSubExpression(pendingOperator.index);
            if (endOfLeftSideExpression === -1) return;

            const updatePendingOperator = this.getPendingOperator();
            if (!updatePendingOperator.token) return;

            pendingOperator.index = updatePendingOperator.index;
        }

        this.#buildAnySubExpressionTree(pendingOperator.index - 1);

        const leftOperand = this.#attemptEvaluateSubExpression();
        if (leftOperand === null) return;
        
        this.#buildPercentExpression(leftOperand, this.#currentInput);

        const result = this.#attemptEvaluateCustomExpression();
        if (result !== null) {
            this.#commitSubResultToCurrentInput(result);
            this.#appendCurrentInput();
        }
    }

    // TODO handle functions and parenthesized sub-expressions
    enter() {
        const lastToken = this.getLastToken();
        if (lastToken && lastToken.type === "enter") {
            const lastOperation = this.getLastOperation();

            this.#removeMultipleSequentialTokens(0);

            if (lastOperation.length === 0) {
                this.#appendCurrentInput();
            } else {
                for (let i = 0; i < lastOperation.length; i++) {
                    this.#appendToken(lastOperation[i]);
                    
                    if (i === 0 && lastOperation[i].type === "operator") {
                        this.#setPendingOperator(lastOperation[i], 0);
                    }
                }

                this.#prependCurrentInput();
            }
        } else if (lastToken && lastToken.type === "rightParen") {
            // do nothing
        } else {
            this.#appendCurrentInput();
        }

        this.#buildExpressionTree();

        const result = this.#attemptEvaluate();
        if (result !== null) {
            this.#commitLastOperation();

            const equalToken = new Token("enter", "=");
            this.#appendToken(equalToken);

            this.#commitResultToCurrentInput(result);
            this.#commitCurrentResult(result);
        }
    }

    isValidResult(value) {
        return typeof value === 'number' && Number.isFinite(value);
    }
}




