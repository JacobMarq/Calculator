
//options menu variables

const historyPanel = document.getElementById("history");
let isHistory = false;
const memoryPanel = document.getElementById("memory");
let isMemory = false;
const barOptionsPanel = document.getElementsByClassName("bar-options");
barOptionsPanel[0].addEventListener('click', function(){ToggleOptionsPanel();});

//dropdown menu variables

const dropDownHamburger = document.getElementsByClassName('dropdown-toggle');
dropDownHamburger[0].addEventListener('click', function(){ToggleDropDown();});
const dropDownMenu = document.getElementById('dialog-container');
let isDropDownActive = false;

//mode related variables

//const modeSelections = document.getElementsByClassName('selection');
//const currentMode = document.getElementById('dropdown-selection');
const calculatorType = document.getElementById('case');
//var selectionsArray = [];
//var typeCalculatorArray = ['Standard', 'Scientific'];
//var typeConverterArray = ['Currency', 'Volume', 'Weight'];
//for(i=0; i<modeSelections.length; i++){
//    selectionsArray.push(modeSelections[i].id);
//} 
//console.table(selectionsArray);

//screen output variables

const EquationLog = document.getElementById('equationLog');
const CurrentNumber = document.getElementById('currentNumber');
let varA = 0;
let isVarA = true;
let varB = null;
let isVarB = false;
let numberResult = null;
let previousVarBUsed = null;
let equationLog = null;
let savedCurrentNumber = null;
CurrentNumber.textContent = varA;

// Possible alternative to allow for operations to be handled in proper order by searching array 

// result array = results
// equation array = saved equations 
// history object = result array and equation array
// operator array = operators used in equation
// function array = variable dependent functions in equation
// variable array = numbers entered in order a, b 


let inputVariableArray = [];
let inputOperatorArray = [];
let inputFunctionArray = [];

//math function variables

let isAddition = false;
let isDivision = false;
let isSubtraction = false;
let isMultiplication = false;
let isExponent = false;
let hasDecimal = false; 

var isFunctionResult = false;
var varBHasFunction = false;

//key layout arrays

const standardKeyArray = ['percent', 'clear-each', 'clear-all', 'clear-backspace',
'one-divided-by-x', 'x-squared', 'sqrt', 'op-divide', '7', '8', '9',
'op-multiply', '4', '5', '6', 'op-subtract', '1', '2', '3', 'op-add', 'toggle-inverse',
'0', 'decimal', 'equals'];
const standardKeyContentArr = ['%', 'CE', 'C', '<-', '1/x', 'x^2', `sqrt`,
'/', '7', '8', '9', '*', '4', '5', '6', '-', '1', '2', '3', '+', '+/-',
'0', '.', '=']

var typeInspector = Array.from(calculatorType.classList);
var currentKeyArray = standardKeyArray;
var currentKeyContentArr = standardKeyContentArr;
const keypadNodelist = document.getElementsByClassName('numpad');
const DialogBox = document.getElementsByClassName('dialog-wrapper');
DialogBox[0].style.display = 'none';


//Options Panel (History/Memory)


function OptionSlide(outPanel, inPanel)
{
    outPanel.setAttribute('class', 'slide-out');
    inPanel.setAttribute('class', 'slide-in');
}
function ToggleOptionsPanel()
{
   if(isHistory)
   { ToggleMemory();}
   else
   { ToggleHistory();}
}
function ToggleHistory()
{
    isHistory = true;
    isMemory = false;
    OptionSlide(memoryPanel, historyPanel);
    console.log(historyPanel.textContent, 'active');
}
function ToggleMemory()
{
    isHistory = false;
    isMemory = true;
    OptionSlide(historyPanel, memoryPanel);
    console.log(memoryPanel.textContent, 'active');
}


//Mode Selection


function ToggleDropDown()
{
    if(!isDropDownActive)
    {   
        DialogBox[0].style.display = 'block';
        setTimeout(ShowDropdownMenu, 5);
    }
    else
    {
        dropDownHamburger[0].classList.remove('toggle-active');
        dropDownMenu.classList.remove('active');
        isDropDownActive = false
        setTimeout(HideDropdownMenu, 250);
        console.log('Dropdown', isDropDownActive);
    }
}
function ShowDropdownMenu()
{
    dropDownHamburger[0].classList.add('toggle-active');
    dropDownMenu.classList.add('active');
    isDropDownActive = true
    console.log('Dropdown', isDropDownActive);
}
function HideDropdownMenu()
{
    DialogBox[0].style.display = 'none';
}


// for(i=0; i<modeSelections.length; i++){
//     modeSelections[i].addEventListener('click', function(e){ChangeMode(e);});
// } 

// function ChangeMode(e)
// {
//     var selection = e.target.id;
//     console.log(selection, 'being applied');
    
//     for(i=0; i<modeSelections.length; i++){
//         if(!modeSelections[i].classList.contains('current'))
//         {
//             continue;
//         }
//         else
//         {
//             modeSelections[i].classList.remove('current');
//         }
//     } 

//     for(i=1; i<selectionsArray.length; i++){
//         calculatorType.classList.remove(selectionsArray[i]);
//     }

//     currentMode.textContent = selection;
//     e.target.classList.add('current');
//     SetNewMode(selection);
//     ToggleDropDown();
// }

// function SetNewMode(selection)
// {
    
//     if(selection == 'Standard'){
//         console.log(selection, 'set');
//     }else{
//         if(typeConverterArray.includes(selection)){
//             console.log('type', 'Converter');
//         }
//         else{
//             calculatorType.classList.add(selection);
//             console.log('type', 'Calculator');
//         }
//     }

//     typeInspector = Array.from(calculatorType.classList);

//     if(typeInspector.includes('Scientific'))
//     {
//         currentKeyArray = 'science';
//     }
//     else
//     {
//         currentKeyArray = standardKeyArray;
//         currentKeyContentArr = standardKeyContentArr;
//     }
//     console.log(currentKeyArray)
// }


//Calculator Assembly



function InsertKeyPadClasses()
{
    for(i=0; i<keypadNodelist.length;i++){
        keypadNodelist[i].classList.add(currentKeyArray[i]);
        if(currentKeyArray[i].match(/clear/))
        {
            keypadNodelist[i].classList.add('erase');
        }
        else if(currentKeyArray[i] == 'equals')
        {
            keypadNodelist[i].classList.add('enter');
        }
        else if(currentKeyArray[i].match(/op/))
        {
            keypadNodelist[i].classList.add('operator');
        }
        else if(currentKeyArray[i].match(/\d/))
        {
            keypadNodelist[i].classList.add('numberkeys');
        }
        else
        {
            keypadNodelist[i].classList.add('functions');
        }
    }
}

function InsertKeyPadContent()
{
    for(i=0; i<keypadNodelist.length;i++){
        keypadNodelist[i].textContent = currentKeyContentArr[i];
        if(currentKeyContentArr[i] == 'sqrt')
        {
            const newSymbol = document.createElement('div');
            newSymbol.className = 'sqrt-symbol';
            newSymbol.innerHTML = '&#x221a' + 'x';
            keypadNodelist[i].textContent = '';
            keypadNodelist[i].appendChild(newSymbol);
        }
        else if(currentKeyContentArr[i] == '<-')
        {
            const newSymbol = document.createElement('img');
            newSymbol.className = 'backspace-symbol';
            newSymbol.src = 'img/backspace-fill.svg';
            keypadNodelist[i].textContent = '';
            keypadNodelist[i].appendChild(newSymbol);
        }
        else if(currentKeyContentArr[i] == '-')
        {            
            const newSymbol = document.createElement('div');
            newSymbol.className = 'subtract-symbol';
            newSymbol.innerHTML = '&#8722';
            keypadNodelist[i].textContent = '';
            keypadNodelist[i].appendChild(newSymbol);
        }
        else if(currentKeyContentArr[i] == '*')
        {
            const newSymbol = document.createElement('div');
            newSymbol.className = 'multiply-symbol';
            newSymbol.innerHTML = '&#215';
            keypadNodelist[i].textContent = '';
            keypadNodelist[i].appendChild(newSymbol);
        }
        else if(currentKeyContentArr[i] == '/')
        {
            const newSymbol = document.createElement('div');
            newSymbol.className = 'divide-symbol';
            newSymbol.innerHTML = '&#247';
            keypadNodelist[i].textContent = '';
            keypadNodelist[i].appendChild(newSymbol);
        }
    }
}

function InsertKeyPadFunctions()
{
    for(i=0; i<keypadNodelist.length;i++){
        if(keypadNodelist[i].classList.contains('numberkeys'))
        {
            keypadNodelist[i].addEventListener('click', (e)=>NumberSelection(e));
        }
        else if(keypadNodelist[i].classList.contains('erase'))
        {
            keypadNodelist[i].addEventListener('click', (e)=>Erase(e));
        }
        else if(keypadNodelist[i].classList.contains('operator'))
        {
            keypadNodelist[i].addEventListener('click', (e)=>OperatorSelection(e));
        }
        else if(keypadNodelist[i].classList.contains('enter'))
        {
            keypadNodelist[i].addEventListener('click', ()=>Enter());
        }
        else if(keypadNodelist[i].classList.contains('toggle-inverse'))
        {
            keypadNodelist[i].addEventListener('click', ()=>ToggleInverse(CurrentNumber.textContent));
        }
        else if(keypadNodelist[i].classList.contains('decimal'))
        {
            keypadNodelist[i].addEventListener('click', ()=>ApplyDecimal(CurrentNumber.textContent));
        }
        else if(keypadNodelist[i].classList.contains('sqrt'))
        {
            keypadNodelist[i].addEventListener('click', ()=>Sqrt(CurrentNumber.textContent));
        }
        else if(keypadNodelist[i].classList.contains('x-squared'))
        {
            keypadNodelist[i].addEventListener('click', ()=>Sq(CurrentNumber.textContent));
        }
        else if(keypadNodelist[i].classList.contains('one-divided-by-x'))
        {
            keypadNodelist[i].addEventListener('click', ()=>OneDividedByx(CurrentNumber.textContent));
        }
        else
        {
            keypadNodelist[i].addEventListener('click', ()=>ClearAll());
        }
    }
}


//Display Functions


function DecimalCheck(a)
{   
    var checkNumber = a.toString();

    if(checkNumber.match(/^\d*\.?\d+e[-+]?\d+/g))
    {
        hasDecimal = false;
    }
    else if(checkNumber.indexOf('.') > 0)
    // else if(checkNumber.match(/^\d*\.?\d*/g))
    {
        hasDecimal = true;
    }
    else
    {
        hasDecimal = false;
    }
}

function RemoveCommas(displayNumber)
{
    var number = displayNumber;
    var newNumber;
    var commaIndex;
    function UpdateNumber()
    {
        number = newNumber;
    }    

    for(i=0; i<(number.length); i++){
        commaIndex = number.indexOf(',');
        newNumber = number.substr(0, commaIndex) + number.substr(commaIndex + 1, number.length);
        UpdateNumber();
    }
    return newNumber;
}

function ApplyCommas()
{
    
    //commas are first removed from the number then assigned from left to right
    var number;
    var decimalPlace;
    var isNegative;

    function UpdateNumber()
    {
        number = CurrentNumber.textContent;
        DecimalCheck(number);
        
        if(number.startsWith('-'))
        {
            isNegative = true
        }
        else
        {
            isNegative = false
        }

        if(hasDecimal)
        {
            decimalPlace = number.indexOf('.');
            console.log('howdy', decimalPlace)
        }
        else
        {
            decimalPlace = number.length
            console.log('no howdy', decimalPlace)
        }
    }

    UpdateNumber();
    
    for(i=0; i<(number.length); i++){
        var commaIndex = number.indexOf(',');
        CurrentNumber.textContent = number.substr(0, commaIndex) + number.substr(commaIndex + 1, number.length);
        UpdateNumber();
    }
        
    if(isNegative)
    {
        if(decimalPlace > 13)
        {
            CurrentNumber.textContent = number.substr(0, decimalPlace - 12) + ',' + number.substr(decimalPlace - 12, number.length);
            UpdateNumber();
            console.log('13 comma'); 
        }
        if(decimalPlace > 10)
        {
            CurrentNumber.textContent = number.substr(0, decimalPlace - 9) + ',' + number.substr(decimalPlace - 9, number.length);
            UpdateNumber();
            console.log('10 comma'); 
        }
        if(decimalPlace > 7)
        {
            CurrentNumber.textContent = number.substr(0, decimalPlace - 6) + ',' + number.substr(decimalPlace - 6, number.length);
            UpdateNumber();
            console.log('7 comma'); 
        }
        if(decimalPlace > 4)
        {
            CurrentNumber.textContent = number.substr(0, decimalPlace - 3) + ',' + number.substr(decimalPlace - 3, number.length);
            UpdateNumber();
            console.log('4 comma');       
        }
    }
    else
    {    
        if(decimalPlace > 12)
        {
            CurrentNumber.textContent = number.substr(0, decimalPlace - 12) + ',' + number.substr(decimalPlace - 12, number.length);
            UpdateNumber();
            console.log('13 comma'); 
        }
        if(decimalPlace > 9)
        {
            CurrentNumber.textContent = number.substr(0, decimalPlace - 9) + ',' + number.substr(decimalPlace - 9, number.length);
            UpdateNumber();
            console.log('10 comma'); 
        }
        if(decimalPlace > 6)
        {
            CurrentNumber.textContent = number.substr(0, decimalPlace - 6) + ',' + number.substr(decimalPlace - 6, number.length);
            UpdateNumber();
            console.log('7 comma'); 
        }
        if(decimalPlace > 3)
        {
            CurrentNumber.textContent = number.substr(0, decimalPlace - 3) + ',' + number.substr(decimalPlace - 3, number.length);
            UpdateNumber();
            console.log('4 comma');       
        }
    }
}

function CheckSciNotation(number)
{
    string = number.toString();
    
    if(string.match(/^\-*\d*\.?\d+e[-+]?\d+/g))
    {   
        return;
    }
    else
    {
        ApplyCommas();
    }
}

function ApplySciNotation(number)
{  
    if(number > 9999999999999 || number < -9999999999999 || hasDecimal && number.length > 12){
        var displayNumber = Number.parseFloat(number).toExponential(5);
        return displayNumber;
    }
    else 
        return number;
}

function LogSplitter()
{
    //finds the index of the operator used in the equation
    var findOp = EquationLog.textContent.match(/(?!\.)[\s]+[+-/*]+/i);
    
    if(isVarA)
    {
        return EquationLog.textContent.length;
    }
    else if(isVarB && varB == null)
    {
        console.log(EquationLog.textContent.lastIndexOf(findOp), 'null');
        return EquationLog.textContent.lastIndexOf(findOp);
    }
    else
    {
        console.log(EquationLog.textContent.lastIndexOf(findOp), 'not null');
        return EquationLog.textContent.lastIndexOf(findOp);
    }
}


//Function Keys


function Sq(x){
    
    if(x == null || x == 0)
    {
        return 0;
    }
    else
    {
        isFunctionResult = true;

        var variable = RemoveCommas(x);
        var result = variable * variable;

        DecimalCheck(result);
        if(hasDecimal)
        {
            result = Number(result.toFixed(2));
        }

        inputFunctionArray.push('x-squared');
        inputVariableArray.push(result);

        if(!isVarB || EquationLog.textContent.match(/[=]+/i))
        {
            EquationLog.innerHTML = variable + '^2';
            console.log(EquationLog.textContent.match(/[=]+/i))

            result = ApplySciNotation(result);
            CurrentNumber.textContent = result;
            CheckSciNotation(result);
        }
        else
        {
            EquationLog.innerHTML = EquationLog.textContent + variable + '^2';
            varB = result;
            varBHasFunction = true;
            
            result = ApplySciNotation(result);
            CurrentNumber.textContent = result;
            CheckSciNotation(result);
        }
    }
}

function OneDividedByx(x){
    
    if(x == null || x == 0)
    {
        alert('You cannot divide by zero!')
    }
    else
    {
        isFunctionResult = true;

        var variable = RemoveCommas(x);
        var result = 1 / variable;

        DecimalCheck(result);
        if(hasDecimal)
        {
            result = Number(result.toFixed(2));
        }

        inputFunctionArray.push('one-divided-by-x');
        inputVariableArray.push(result);

        if(!isVarB || EquationLog.textContent.match(/[=]+/i))
        {
            EquationLog.innerHTML = '(1/' + variable + ')';
            console.log(EquationLog.textContent.match(/[=]+/i))

            result = ApplySciNotation(result);
            CurrentNumber.textContent = result;
            CheckSciNotation(result);
        }
        else
        {
            EquationLog.innerHTML = EquationLog.textContent + '(1/' + variable + ')';
            varB = result;
            varBHasFunction = true;
            
            result = ApplySciNotation(result);
            CurrentNumber.textContent = result;
            CheckSciNotation(result);
        }
    }
}

function Sqrt(x)
{
    if(x < 0){
        alert('The square root of a negative number is not a Real Number!');
        return;
    }
    
    if(x == null || x == 0)
    {
        return 0;
    }
    else
    {
        isFunctionResult = true;

        var variable = RemoveCommas(x);
        var result = Math.sqrt(variable);

        DecimalCheck(result);
        if(hasDecimal)
        {
            result = Number(result.toFixed(2));
        }

        inputFunctionArray.push('sqrt');
        inputVariableArray.push(result);

        if(!isVarB || EquationLog.textContent.match(/[=]+/i))
        {
            EquationLog.innerHTML = '&#x221a' + '(' + variable + ')';

            result = ApplySciNotation(result);
            CurrentNumber.textContent = result;
            CheckSciNotation(result);
        }
        else
        {
            EquationLog.innerHTML = EquationLog.textContent + '&#x221a' + '(' + variable + ')';
            varB = result;
            varBHasFunction = true;
            
            result = ApplySciNotation(result);
            CurrentNumber.textContent = result;
            CheckSciNotation(result);
        }
    }
}

function Percent(number)
{
    var percentResult;
    var percentage;
    if(varB == null || varB == 0)
    {
        percentResult = 0;
        CurrentNumber = 0;
        EquationLog = 0;
    }
    else
    {
        percentage = (varA/100)*varB;
    }
    numberResult = (varA/100)*varB;
}

function ToggleInverse(number)
{
    var newNumber = Number(RemoveCommas(number));
    
    if(number == 0)
    {
        return;
    }
    else
    {
        newNumber =  (newNumber * -1);
        newNumber = ApplySciNotation(newNumber);
        CurrentNumber.textContent = newNumber;
        CheckSciNotation(CurrentNumber.textContent);
    }
}

function ApplyDecimal(number)
{
    DecimalCheck(number);
    if(hasDecimal || number.match(/^\d*\.?\d+e[-+]?\d+/g))
    {
        alert('Decimal limit reached!')
    }
    else
    {
        CurrentNumber.textContent = number + '.';
    }
}


//Operator Keys


function OperatorSelection(operator)
{
    var whichOperator = operator;

    if(isVarB && EquationLog.textContent.includes(' / ') && CurrentNumber.textContent == '0')
    {
        alert('You cannot divide by zero!')
        return;
    }

    if(typeof(operator) === 'object')
    {
        whichOperator = operator.target.className;
    }

    //updates the equation log with either the current number or the function operation to acheieve the current number
    if(inputFunctionArray.length > 0)
    {
        
        var opIndex;

        opIndex = LogSplitter();

        if(whichOperator.match(/add/i))
        {
            EquationLog.textContent = EquationLog.textContent.substring(0, opIndex) + ' + ';

            ApplyOperator('add');
        }
        else if(whichOperator.match(/subtract/i))
        {
            EquationLog.textContent = EquationLog.textContent.substring(0, opIndex) + ' - ';

            ApplyOperator('subtract');
        }
        else if(whichOperator.match(/divide/i))
        {
            EquationLog.textContent = EquationLog.textContent.substring(0, opIndex) + ' / ';

            ApplyOperator('divide');
        }
        else if(whichOperator.match(/multiply/i))
        {
            EquationLog.textContent = EquationLog.textContent.substring(0, opIndex) + ' * ';

            ApplyOperator('multiply');
        }
    }
    else
    {
        if(whichOperator.match(/add/i))
        {
            EquationLog.textContent = Number(RemoveCommas(CurrentNumber.textContent)) + ' + ';
    
            ApplyOperator('add');
        }
        else if(whichOperator.match(/subtract/i))
        {
            EquationLog.textContent = Number(RemoveCommas(CurrentNumber.textContent)) + ' - ';
    
            ApplyOperator('subtract');
        }
        else if(whichOperator.match(/divide/i))
        {
            EquationLog.textContent = Number(RemoveCommas(CurrentNumber.textContent)) + ' / ';
    
            ApplyOperator('divide');
        }
        else if(whichOperator.match(/multiply/i))
        {
            EquationLog.textContent = Number(RemoveCommas(CurrentNumber.textContent)) + ' * ';
    
            ApplyOperator('multiply');
        }
    }
}

function ApplyOperator(operator)
{
    //when on the first variable the operator is saved and placed on the log
    //when on the second variable the previous variable stays displayed
    //operators are still selectable until user input
    //after input operator keys trigger the previously saved operation
    if(isVarA)
    {
        varA = Number(RemoveCommas(CurrentNumber.textContent));
        equationLog = [varA, operator];
        isVarA = false;
        isVarB = true;
    }
    else if(isVarB && varB == null)
    {
        equationLog = [varA, operator];
        numberResult = null;
    }
    else
    {
        //solves the current equation
        //sets 'varA' of a new equation equal to the result

        varB = Number(RemoveCommas(CurrentNumber.textContent));
        numberResult = DoOperation(equationLog[1]);
        DecimalCheck(numberResult);
        if(hasDecimal)
        {
            numberResult = Number(numberResult.toFixed(2));
        }

        equationLog = [varA, operator, varB];
        varB = null;
        varA = numberResult;
        equationLog = [varA, operator];

        numberResult = ApplySciNotation(numberResult);
        CurrentNumber.textContent = numberResult;

        let opIndex = LogSplitter();
        EquationLog.textContent = numberResult + EquationLog.textContent.substring(opIndex, EquationLog.textContent.length);
        CheckSciNotation(numberResult);

        inputFunctionArray.length = 0;
        varBHasFunction = false;
    }
}

function DoOperation(operator)
{
    var result;
    
    if(operator.match(/add/))
    {
        result = varA + varB;
    }
    else if(operator.match(/subtract/))
    {
        result = varA - varB;
    }
    else if(operator.match(/divide/))
    {
        result = varA / varB;
    }
    else if(operator.match(/multiply/))
    {
        result = varA * varB;
    }

    return result;
}

function Enter()
{
    if(EquationLog.textContent.includes(' / ') && CurrentNumber.textContent == '0')
    {
        alert('You cannot divide by zero!');
        return;
    }
    
    if(isVarB && Math.abs(RemoveCommas(CurrentNumber.textContent)) == Math.abs(numberResult))//check if entering variable b and the current number is equal to the result of the last equation 
    {        
        varB = previousVarBUsed; // makes variable b in the new equation the same variable applied to the last equation
        let opIndex = LogSplitter();
        EquationLog.textContent = RemoveCommas(CurrentNumber.textContent) + EquationLog.textContent.substring(opIndex, EquationLog.textContent.length);
        
        numberResult = DoOperation(equationLog[1]);
        DecimalCheck(numberResult);
        if(hasDecimal)
        {
            numberResult = Number(numberResult.toFixed(2));
        }

        equationLog.push(varB, ' = ');
        varB = null;
        varA = numberResult;

        numberResult = ApplySciNotation(numberResult);
        CurrentNumber.textContent = numberResult;
        CheckSciNotation(numberResult);

    }
    else if(isVarB)
    {
        if(varBHasFunction)
        {
            EquationLog.textContent = EquationLog.textContent + ' = ';
        }
        else
        {
            EquationLog.textContent = EquationLog.textContent + RemoveCommas(CurrentNumber.textContent) + ' = ';
        }
        varB = Number(RemoveCommas(CurrentNumber.textContent));

        numberResult = DoOperation(equationLog[1]);
        DecimalCheck(numberResult);
        if(hasDecimal)
        {
            numberResult = Number(numberResult.toFixed(2));
        }

        equationLog.push(varB, ' = ');
        previousVarBUsed = varB;
        varB = null;
        varA = numberResult;
        
        numberResult = ApplySciNotation(numberResult);
        CurrentNumber.textContent = numberResult;
        CheckSciNotation(numberResult);

    }
    else if(isVarA)
    {
        EquationLog.textContent = Number(RemoveCommas(CurrentNumber.textContent)) + ' = ';
    }
    
    inputFunctionArray.length = 0;
    varBHasFunction = false;

}


//Number Keys


function NumberSelection(number)
{
    //ApplyCommas allows the interface to be more visually pleasing while the value of
    //each number is saved and used in standard form for functionality

    var whichNumber = number.target.classList;


        for(i=0; i<10; i++){
            if(!whichNumber.contains(i))
            {
                continue;
            }
            else
            {
                InjectNumber(i);
                break;
            }
        }

    ApplyCommas();
}

function InjectNumber(input)
{
    var currentNumberLength = CurrentNumber.textContent.length;
    numberResult = null;
    
    if(isVarB && EquationLog.textContent.match(/=/))
    {
        CurrentNumber.textContent = input;
        EquationLog.textContent = '';
        varA = 0;
        isVarA = true;
        isVarB = false;    
    }
    else if(isVarB && varB == null || isVarB && varB == /[0]$/)
    {
        CurrentNumber.textContent = input;
        varB = CurrentNumber.textContent;
    }
    else if(CurrentNumber.textContent == '0' || isFunctionResult)
    {
        CurrentNumber.textContent = input;
        isFunctionResult = false;
        console.log(CurrentNumber.textContent)
    }
    else
    {
        if(currentNumberLength >= 17)
        {
            savedCurrentNumber = CurrentNumber.textContent;
            alert('Number length cannot exceed 13 digits');
        }
        else
        {
            CurrentNumber.textContent = CurrentNumber.textContent + input;
            console.log(CurrentNumber.textContent);
        }
    }
}


//Erase Keys


function Erase(which)
{ 
    var whichEraser = which.target.className;
    
    if(whichEraser.match(/each/))
    {
        console.log('each');
        ClearEach();
    }
    else if(whichEraser.match(/backspace/))
    {
        console.log('backspace');
        BackSpace();
    }
    else if(whichEraser.match(/all/))
    {
        console.log('all');
        ClearAll();
    }
}

function ClearAll()
{
    varA = 0;
    varB = null;
    isVarB = false;
    isVarA = true;
    inputFunctionArray.length = 0;
    varBHasFunction = false;
    CurrentNumber.textContent = '0';
    EquationLog.textContent = '';
    equationLog = [];
}

function ClearEach()
{
    isVarA ? varA = 0 : varB = 0;
    CurrentNumber.textContent = '0';
}

function BackSpace()
{
    var content = CurrentNumber.textContent;
    if(content.match(/e/)) //prevents backspace with scientific notation
    {
        return;
    }
    else if(CurrentNumber.textContent.match(/^[\-]?\d?$/)) //checks if current number is a single digit negative
    {
        CurrentNumber.textContent = '0';
    }
    else if(content.length > 1)
    {
        CurrentNumber.textContent = content.slice(0, -1);
        ApplyCommas();
    }
    else
    {
        CurrentNumber.textContent = '0';
    }
}


//Keyboard response


function Pressedkey(e){
    console.log(`you pressed the ${e.key} key`);
    if(e.key.match(/[0-9]/))
    {   
        numKey = (e.key);
        HighlightKey(numKey);
        InjectNumber(e.key);
        ApplyCommas();
    }
    else if(holdingShift && !e.key.match(/\W/g)) //check for shift + e where 'e' == key pressed
    {
        if(e.key.match(/delete/i) || e.key.match(/backspace/i)){
            ClearAll();
            HighlightKey('.clear-all');
        }
        if(e.key.match(/^[i]/i)){
            ToggleInverse(CurrentNumber.textContent);
            HighlightKey('.toggle-inverse');
        }
        if(e.key.match(/^[r]/i)){
            Sqrt(CurrentNumber.textContent);
            HighlightKey('.sqrt');
        }
        if(e.key.match(/^[s]/i)){
            Sq(CurrentNumber.textContent);
            HighlightKey('.x-squared');
        }
        if(e.key.match(/^[d]/i)){
            OneDividedByx(CurrentNumber.textContent);
            HighlightKey('.one-divided-by-x');
        }
    }
    else
    {
        switch(e.key)
        {
            case 'Shift':
                holdingShift = true;
                console.log(holdingShift);
                break;   
            case 'Delete':
                ClearEach();
                HighlightKey('.clear-each');
                break;   
            case '.':
                ApplyDecimal(CurrentNumber.textContent);
                HighlightKey('.decimal');
                break;   
            case 'Backspace':
                BackSpace();
                HighlightKey('.clear-backspace');
                break;
            case '+':
                OperatorSelection('add');
                HighlightKey('.op-add');
                break;   
            case '-':
                OperatorSelection('subtract');
                HighlightKey('.op-subtract');
                break;   
            case '*':
                OperatorSelection('multiply');
                HighlightKey('.op-multiply');
                break;  
            case '/':
                OperatorSelection('divide');
                HighlightKey('.op-divide');
                break;
            case 'Enter':
                Enter();
                HighlightKey('.equals');
                break; 
            case '%':
                //Percent();
                HighlightKey('.percent');
                break;
        }
    }
}

function HighlightKey(key)
{
    if(key.match(/^[0-9]/)){
        const numberKeys = document.querySelectorAll('.numberkeys');

        switch(key){
            case '7':
                numberKeys[0].classList.add('highlight');
                break;
            case '8':
                numberKeys[1].classList.add('highlight');
                break;
            case '9':
                numberKeys[2].classList.add('highlight');
                break;
            case '4':
                numberKeys[3].classList.add('highlight');
                break;
            case '5':
                numberKeys[4].classList.add('highlight');
                break;
            case '6':
                numberKeys[5].classList.add('highlight');
                break;
            case '1':
                numberKeys[6].classList.add('highlight');
                break;
            case '2':
                numberKeys[7].classList.add('highlight');
                break;
            case '3':
                numberKeys[8].classList.add('highlight');
                break;
            case '0':
                numberKeys[9].classList.add('highlight');
                break;
        }
    }
    else{
        const keyToHighlight = document.querySelectorAll(key);

        keyToHighlight[0].classList.add('highlight');
    }
}

function RemoveHighlight(e)
{   
    if (!this.classList.contains('highlight')){
        return;
    }
    else{
        console.log(e)
        this.classList.remove('highlight');
    }
}

let holdingShift =  false;
const keys = document.querySelectorAll('.numpad');
keys.forEach(key => key.addEventListener('transitionend', RemoveHighlight));


//OnStart


document.addEventListener('keydown', (e)=> Pressedkey(e));
document.addEventListener('keyup', (e)=>{
    if(e.key=='Shift') {
        holdingShift = false; 
        console.log(holdingShift);
    } 
    else {
        return;
    }});
ToggleOptionsPanel();
InsertKeyPadClasses();
InsertKeyPadContent();
InsertKeyPadFunctions();