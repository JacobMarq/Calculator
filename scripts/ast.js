export class NumberNode {
    constructor(value) {
        this.type = "number";
        this.value = value;
    }
}

export class UnaryNode {
    constructor(operator, operand) {
        this.type = "unary";
        this.operator = operator;
        this.operand = operand;
    }
}

export class BinaryNode {
    constructor(operator, left, right) {
        this.type = "binary";
        this.operator = operator;
        this.left = left;
        this.right = right;
    }
}