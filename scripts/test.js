import { parse } from "./parser.js";
import { evaluate } from "./evaluator.js";

class Token {
    constructor(type, value) {
        this.type = type;
        this.value = value;
    }
}

// 5 + 3 = 8
const e0 = [
    new Token("number", 5), 
    new Token("operator", "+"), 
    new Token("number", 3)
];

// -5 + (3 * 2) = 1
const e1 = [
    new Token("operator", "-"),
    new Token("number", 5),
    new Token("operator", "+"), 
    new Token("leftParen", "("),
    new Token("number", 3),
    new Token("operator", "*"), 
    new Token("number", 2),
    new Token("rightParen", ")"),
];

// 5 * 3 + 2 = 17
const e2 = [
    new Token("number", 5),
    new Token("operator", "*"),
    new Token("number", 3),
    new Token("operator", "+"),
    new Token("number", 2)
];

// 10 - 3 - 2 = 5
const e3 = [
    new Token("number", 10), 
    new Token("operator", "-"),
    new Token("number", 3),
    new Token("operator", "-"),
    new Token("number", 2)
];

// 10 / 5 * 2 = 4
const e4 = [
    new Token("number", 10), 
    new Token("operator", "/"),
    new Token("number", 5),
    new Token("operator", "*"),
    new Token("number", 2)
];

// 10 - (2 * 3 + 4) = 0
const e5 = [
    new Token("number", 10), 
    new Token("operator", "-"),
    new Token("leftParen", "("),
    new Token("number", 2),
    new Token("operator", "*"),
    new Token("number", 3),
    new Token("operator", "+"),
    new Token("number", 4),
    new Token("rightParen", ")")
];

const e6 = [
    new Token("number", 10), 
    new Token("operator", "-"),
];

const expressionList = [e0,e1,e2,e3,e4,e5,e6];

for (let i = 0; i < expressionList.length; i++) {
    try {
        const tree = parse(expressionList[i]);
        
        console.log(tree);
        console.log(evaluate(tree));
    } catch (error) {
        console.log(error);
    }
}