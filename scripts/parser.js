import {
    NumberNode,
    UnaryNode,
    BinaryNode
} from "./ast.js";

const operators = {
    "+": {
        precedence: 10,
        associativity: "left"
    },

    "-": {
        precedence: 10,
        associativity: "left"
    },

    "*": {
        precedence: 20,
        associativity: "left"
    },

    "/": {
        precedence: 20,
        associativity: "left"
    }
}

const prefixOperators = {
    "-": {
        precedence: 30
    }
}

const functions = {
    "negate": true,
    "sqrt": true,
    "sqr": true,
    "1/": true
}

export class Parser {
    constructor(tokens) {
        this.tokens = tokens;
        this.position = 0;
    }

    current() {
        return this.tokens[this.position];
    }

    consume() {
        const token = this.current();
        this.position++;

        return token;
    }

    parse() {
        if (this.tokens.length === 0) {
            return null;
        }

        const expression = this.parseExpression(0);

        if (this.current() !== undefined) {
            throw new Error(
              `Expression Consumption Failed: Unexpected token: ${this.current().value}`  
            );
        }

        return expression;
    }

    parseExpression(minPrecedence) {
        let left = this.parsePrefix();

        while (true) {
            const token = this.current();
            if (!token) break;
            if (token.type === "rightParen") break;
            if (token.type !== "operator") break;

            const operator = operators[token.value];
            if (!operator) break;
            if (operator.precedence < minPrecedence) break;

            this.consume();

            // maintain left side dominance for operators of similar precedence
            const nextPrecedence = operator.associativity === "left" ? operator.precedence + 1 : operator.precedence;
            const right = this.parseExpression(nextPrecedence);

            left = new BinaryNode(token.value, left, right);
        }

        return left;
    }

    parsePrefix() {
        const token = this.current();
        if (!token) throw new Error("Expected expression.");

        // functions
        if (token.type === "function") {
            const functionToken = this.consume();

            const openingToken = this.current();
            if (!openingToken || openingToken.type !== "leftParen") {
                throw new Error(
                    `Expected opening parenthesis after function: ${functionToken.value}`
                );
            }

            this.consume();

            const operand = this.parseExpression(0);
            const closingToken = this.current();
            if (!closingToken || closingToken.type !== "rightParen") {
                throw new Error(
                    `Expected opening parenthesis after function: ${functionToken.value}`
                );
            }

            this.consume();

            return new UnaryNode(
                functionToken.value,
                operand
            )
        }

        // Unary Operator
        if (token.type === "operator" && prefixOperators[token.value]) {
            const operator = this.consume();
            const prefix = prefixOperators[operator.value];
            const operand = this.parseExpression(prefix.precedence);
            
            return new UnaryNode(
                operator.value,
                operand
            );
        }

        // Paranthesized expression
        if (token.type === "leftParen") {
            this.consume();

            const expression = this.parseExpression(0);
            const closingToken = this.current();
            if (!closingToken || closingToken.type !== "rightParen") {
                throw new Error("Expected closing parenthesis.");
            }

            this.consume();

            return expression;
        }

        // Number
        if (token.type === "number") {
            this.consume();

            return new NumberNode(token.value);
        }

        throw new Error(
            `Unexpected token: ${token.value}`
        );
    }
}

export function parse(tokens) {
    const parser = new Parser(tokens);
    
    return parser.parse();
}