import { CalculatorState } from "./calculator.js";

// DOM REFERENCES (In Progress)

const historyElement = document.getElementById("history--");
const historyWrapper = document.getElementById("history-wrapper");

const memoryElement = document.getElementById("memory--");
const memoryWrapper = document.getElementById("memory-wrapper");

const headOptions = document.getElementById("head-options");
const dropdownToggle = document.getElementById("dropdown-toggle");

const dialogContainer = document.getElementById("dialog-container");

const caseElement = document.getElementById("case");
const equationLog = document.getElementById("equationLog");
const currentNumber = document.getElementById("currentNumber");

// Initialize State

const Calculator = new CalculatorState();

// Actual UI functions

function UpdateEquationLog() {
    const tokens = Calculator.getExpressionTokens();
    if (tokens.length > 1) {
        const equationLogString = tokens.join(' ');
        equationLog.textContent = equationLogString;
    } else if (tokens.length == 1) {
        equationLog.textContent = tokens[0];
    } else {
        equationLog.textContent = '';
    }
}

function UpdateCurrentNumber() {
    const input = Calculator.getCurrentInputDisplay();
    if (input !== null) {
        currentNumber.textContent = input;
    } else {
        currentNumber.textContent = "Null";
    }
}

function UpdateDisplay() {
    UpdateEquationLog();
    UpdateCurrentNumber();

    if (Calculator.getErrorMode()) {
        console.log("error");
    };
}

// KEYPAD DEFINITIONS

const standardKeyArray = [
    "memoryClear",
    "memoryRecall",
    "memoryAdd",
    "memorySubtract",
    "memoryStore",

    "percent",
    "clear-each",
    "clear-all",
    "clear-backspace",

    "one-divided-by-x",
    "x-squared",
    "sqrt",
    "op-divide",

    "7",
    "8",
    "9",
    "op-multiply",

    "4",
    "5",
    "6",
    "op-subtract",

    "1",
    "2",
    "3",
    "op-add",

    "toggle-inverse",
    "0",
    "decimal",
    "enter"
];

const standardKeyContentArr = [
    "MC",
    "MR",
    "M+",
    "M-",
    "MS",

    "%",
    "CE",
    "C",
    "⌫",

    "¹/ₓ",
    "x²",
    "√x",
    "÷",

    "7",
    "8",
    "9",
    "×",

    "4",
    "5",
    "6",
    "−",

    "1",
    "2",
    "3",
    "+",

    "±",
    "0",
    ".",
    "="
];

// KEYPAD DOM SETUP

function InsertKeyPadClasses()
{
    const keys = document.querySelectorAll("[data-key]");

    keys.forEach( 
        function(key) {
            const keyName = key.getAttribute("data-key");
        
            if(keyName.match(/clear/))
            {
                key.classList.add('erase');
            }
            else if(keyName == 'equals')
            {
                key.classList.add('enter');
            }
            else if(keyName.match(/op/))
            {
                key.classList.add('operator');
            }
            else if(keyName.match(/\d/))
            {
                key.classList.add('numberkeys');
            }
            else
            {
                key.classList.add('functions');
            }

            key.classList.add('unselectable');
        }
    );
}

function InsertKeyPadContent() {
    const keys = document.querySelectorAll("[data-key]");

    keys.forEach(
        function(key) {
            const keyName = key.getAttribute("data-key");
            const index = standardKeyArray.indexOf(keyName);

            if (index >= 0) {
                key.textContent = standardKeyContentArr[index];
            }
        }
    );
}

function InsertKeyPadFunctions() {
    const keys = document.querySelectorAll("[data-key]");

    keys.forEach(
        function(key) {
            const keyName = key.getAttribute("data-key");

            switch (keyName) {
                case "memoryClear":
                    key.addEventListener("click", MemoryClear);
                    break;

                case "memoryRecall":
                    key.addEventListener("click", MemoryRecall);
                    break;

                case "memoryAdd":
                    key.addEventListener("click", MemoryAdd);
                    break;

                case "memorySubtract":
                    key.addEventListener("click", MemorySubtract);
                    break;

                case "percent":
                    key.addEventListener("click", Percent);
                    break;

                case "clear-each":
                    key.addEventListener("click", ClearEach);
                    break;

                case "clear-all":
                    key.addEventListener("click", Clear);
                    break;

                case "clear-backspace":
                    key.addEventListener("click", Erase);
                    break;

                case "one-divided-by-x":
                    key.addEventListener("click", OneDividedByx);
                    break;

                case "x-squared":
                    key.addEventListener("click", Sqr);
                    break;

                case "sqrt":
                    key.addEventListener("click", Sqrt);
                    break;

                case "op-divide":
                    key.addEventListener("click", function() { OperatorSelection("/"); });
                    break;

                case "op-multiply":
                    key.addEventListener("click", function() { OperatorSelection("*"); });
                    break;

                case "op-subtract":
                    key.addEventListener("click", function() { OperatorSelection("-"); });
                    break;

                case "op-add":
                    key.addEventListener("click", function() { OperatorSelection("+"); });
                    break;

                case "toggle-inverse":
                    key.addEventListener("click", ToggleInverse );
                    break;

                case "decimal":
                    key.addEventListener("click", Decimal);
                    break;

                case "enter":
                    key.addEventListener("click", Enter);
                    break;

                default:
                    if (keyName && /^[0-9]$/.test(keyName)) {
                        key.addEventListener("click", function() { InjectNumber(keyName); });
                    }
                    break;
            }
        }
    );
}

// KEYPAD FUNCTIONS

function InjectNumber(keyName) {
    console.log(`InjectNumber ${keyName}`);
    Calculator.injectNumber(keyName);
    UpdateDisplay();
}

function Decimal() {
    console.log("Decimal");
    Calculator.addDecimal();
    UpdateCurrentNumber();
}

function Erase() {
    console.log("Erase/Backspace");
    Calculator.backspace();
    UpdateDisplay();
}

function ClearEach() {
    console.log("ClearEach");
    Calculator.clearEach();
    UpdateDisplay();
}

function Clear() {
    console.log("Clear");
    Calculator.clear();
    UpdateDisplay();
}

function ToggleInverse() {
    console.log("ToggleInverse");
    Calculator.toggleInverse();
    UpdateDisplay();
}

function Sqrt() {
    console.log("Sqrt");
    Calculator.sqrt();
    UpdateDisplay();
}

function Sqr() {
    console.log("Sqr");
    Calculator.sqr();
    UpdateDisplay();
}

function OneDividedByx() {
    console.log("1/x");
    Calculator.oneDividedByX();
    UpdateDisplay();
}

function Percent() {
    console.log("%");
    Calculator.percent();
    UpdateDisplay();
}

function OperatorSelection(operator) {
    console.log(`OperatorSelection ${operator}`);
    Calculator.operatorSelection(operator);
    UpdateDisplay();
}

function Enter() {
    console.log("Enter");
    Calculator.enter();
    UpdateDisplay();
}

// HISTORY (Not Started)

function AddHistory(expression, result) {}

function ClearHistory() {}

// MEMORY (Not Started)

function UpdateMemoryDisplay() {}

function MemoryClear() {}

function MemoryRecall() {}

function MemoryAdd() {}

function MemorySubtract() {}

// KEYBOARD INPUT

function HandleKeyboardInput(event){
    const key = event.key;

    if (key.match(/[0-9]/))
    {   
        HighlightKey(key);
        InjectNumber(key);
    } else if (holdingShift && !key.match(/\W/g)) {
        if(key.match(/^[r]/i)){
            HighlightKey('memoryRecall');
            MemoryRecall();
        }
        if(key.match(/^[c]/i)){
            HighlightKey('memoryClear');
            MemoryClear();
        }
        if(key.match(/^[q]/i)){
            HighlightKey('memoryAdd');
            MemoryAdd();
        }
        if(key.match(/^[e]/i)){
            HighlightKey('memorySubtract');
            MemorySubtract();
        }
        if(key.match(/^[s]/i)){
            HighlightKey('memoryStore');
            MemoryStore();
        }
        if(key.match(/delete/i) || key.match(/backspace/i)){
            HighlightKey('clear-all');
            ClearAll();
        }
    } else {
        switch(key)
        {
            case 'Shift':
                holdingShift = true;
                break;

            case 'Delete':
                HighlightKey('clear-each');
                ClearEach();
                break;

            case '.':
                HighlightKey('decimal');
                ApplyDecimal();
                break;

            case 'Backspace':
                HighlightKey('clear-backspace');
                BackSpace();
                break;

            case '+':
                HighlightKey('op-add');
                OperatorSelection("+");
                break;

            case '-':
                HighlightKey('op-subtract');
                OperatorSelection("-");
                break;

            case '*':
                HighlightKey('op-multiply');
                OperatorSelection("*");
                break;

            case '/':
                event.preventDefault();

                HighlightKey('op-divide');
                OperatorSelection("/");
                break;

            case 'Enter':
                event.preventDefault();

                HighlightKey('enter');
                Enter();
                break;

            case '%':
                HighlightKey('percent');
                Percent();
                break;

            case 'i':
            case 'I':
                HighlightKey('toggle-inverse');
                ToggleInverse();
                break;

            case 'r':
            case 'R':
                HighlightKey('sqrt');
                Sqrt();
                break;

            case 's':
            case 'S':
                HighlightKey('x-squared');
                Sqr();
                break;

            case 'd':
            case 'D':
                HighlightKey('one-divided-by-x');
                OneDividedByx();
                break;
        }
    }
}

let holdingShift =  false;
document.addEventListener("keydown", HandleKeyboardInput);
document.addEventListener('keyup', (e)=>{
    if (e.key !== 'Shift') return
    
    holdingShift = false;
});

// HIGHLIGHTING

function RemoveKeyHighlights() {
    const keys = document.querySelectorAll("[data-key]");

    keys.forEach(
        function(key) {
            key.classList.remove("selected");
            key.classList.remove("active");
            key.classList.remove("highlight");
        }
    );
}

function HighlightKey(keyName) {
    RemoveKeyHighlights();

    const key = document.querySelector(`[data-key="${keyName}"]`);
    if (!key) return;

    key.classList.add("selected");
    key.classList.add("active");
    key.classList.add("highlight");
}

function InsertAutomatedHighlightRemoval() {
    const keys = document.querySelectorAll('.numpad');
    const mryKeys = document.querySelectorAll('.memorybtn');
    keys.forEach(key => key.addEventListener('transitionend', RemoveKeyHighlights));
    mryKeys.forEach(mrykey => mrykey.addEventListener('transitionend', RemoveKeyHighlights));
}

// INITIALIZATION

function InitializeCalculator() {
    InsertKeyPadClasses();
    InsertKeyPadContent();
    InsertKeyPadFunctions();
    InsertAutomatedHighlightRemoval()

    UpdateMemoryDisplay();
    UpdateDisplay();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", InitializeCalculator);
} else {
    InitializeCalculator();
}