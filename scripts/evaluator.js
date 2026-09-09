export function evaluate(node) {
    if (!node) throw new Error("Cannot evaluate an empty expression");

    switch (node.type) {
        case "number":
            return node.value;

        case "unary":
            return evaluateUnary(node);
        
        case "binary":
            return evaluateBinary(node);

        default:
            throw new Error(
                `Unknown AST node type: ${node.type}`
            );
    }
}

function evaluateUnary(node) {
    const operand = evaluate(node.operand);

    switch (node.operator) {
        case "-":
            return operand * -1;

        case "negate":
            return operand * -1;

        case "sqrt":
            return Math.sqrt(operand);

        case "sqr":
            return operand ** 2;

        case "1/":
            return 1 / operand;

        default:
            throw new Error(
                `Unknown unary operator: ${node.operator}`
            );
    }
}

function evaluateBinary(node) {
    const left = evaluate(node.left);
    const right = evaluate(node.right);

    switch (node.operator) {
        case "+":
            return left + right;

        case "-":
            return left - right;

        case "*":
            return left * right;

        case "/":
            if (right === 0) throw new Error("Division by zero.");
            return left / right;

        default:
            throw new Error(
                `Unknown binary operator: ${node.operator}`
            );
    }
}