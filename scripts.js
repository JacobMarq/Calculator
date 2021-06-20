
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

const modeSelections = document.getElementsByClassName('selection');
const currentMode = document.getElementById('dropdown-selection');
const calculatorType = document.getElementById('case');
var selectionsArray = [];
var typeCalculatorArray = ['Standard', 'Scientific'];
var typeConverterArray = ['Currency', 'Volume', 'Weight'];
for(i=0; i<modeSelections.length; i++){
    selectionsArray.push(modeSelections[i].id);
} 
console.table(selectionsArray);

//screen output variables

const EquationLog = document.getElementById('equationLog');
const CurrentNumber = document.getElementById('currentNumber');
let numberA = 0;
let isNumberA = true;
let numberB = null;
let isNumberB = false;
let numberResult = null;
let previousNumber = null;
let equationLog = null;
let isPreviousResult = false;
let savedCurrentNumber = null;
console.log(numberA - numberB);
CurrentNumber.textContent = numberA;

//math function variables

let isAddition = false;
let isDivision = false;
let isSubtraction = false;
let isMultiplication = false;
let isExponent = false;
let hasDecimal = false; 

//keypad arrays
const standardKeyArray = ['percent', 'clear-each', 'clear-all', 'clear-backspace',
'one-divided-by-x', 'x-squared', 'sqrt', 'op-divide', '7', '8', '9',
'op-multiply', '4', '5', '6', 'op-subtract', '1', '2', '3', 'op-add', 'toggle-inverse',
'0', 'decimal', 'equals'];
const standardKeyContentArr = ['%', 'CE', 'C', '<-', '1/x', 'x^2', `sqrt`,
'/', '7', '8', '9', '*', '4', '5', '6', '-', '1', '2', '3', '+', '+/-',
'0', '.', '=']
const standardKeyFunctionsArr = []

var typeInspector = Array.from(calculatorType.classList);
var currentKeyArray = standardKeyArray;
var currentKeyContentArr = standardKeyContentArr;
var currentKeyFunctionsArr = standardKeyFunctionsArr;

ToggleOptionsPanel();


//Hamburger


function ToggleDropDown()
{
    if(!isDropDownActive)
    {   
        dropDownHamburger[0].classList.add('toggle-active');
        dropDownMenu.classList.add('active');
        isDropDownActive = true
        console.log('Dropdown', isDropDownActive);
    }
    else
    {
        dropDownHamburger[0].classList.remove('toggle-active');
        dropDownMenu.classList.remove('active');
        isDropDownActive = false
        console.log('Dropdown', isDropDownActive);
    }
}


//mode selection


for(i=0; i<modeSelections.length; i++){
    modeSelections[i].addEventListener('click', function(e){ChangeMode(e);});
} 


//applies the current modes style changes


function SetNewMode(selection)
{
    
    if(selection == 'Standard'){
        console.log(selection, 'set');
    }else{
        if(typeConverterArray.includes(selection)){
            console.log('type', 'Converter');
        }
        else{
            calculatorType.classList.add(selection);
            console.log('type', 'Calculator');
        }
    }

    typeInspector = Array.from(calculatorType.classList);

    if(typeInspector.includes('Scientific'))
    {
        currentKeyArray = 'science';
    }
    else
    {
        currentKeyArray = standardKeyArray;
    }
    console.log(currentKeyArray)
}


//sets the new mode


function ChangeMode(e)
{
    var selection = e.target.id;
    console.log(selection, 'being applied');
    
    for(i=0; i<modeSelections.length; i++){
        modeSelections[i].classList.remove('current');
    } 

    for(i=1; i<selectionsArray.length; i++){
        calculatorType.classList.remove(selectionsArray[i]);
    }

    currentMode.textContent = (selection);
    e.target.classList.add('current');
    SetNewMode(selection);
    ToggleDropDown();
}


//option transition to allow for further functionality


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


//Display functions

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


//variable reliant key functions


function ApplyFunction()
{

}

function Percent()
{
    var percentResult;
    var percentage;
    if(numberB == null || numberB == 0)
    {
        percentResult = 0;
        CurrentNumber = 0;
        EquationLog = 0;
    }
    else
    {
        percentage = (numberA/100)*numberB;
    }
    numberResult = (numberA/100)*numberB;
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
        if(newNumber > 9999999999999 || newNumber < -9999999999999)
        {   
            var displayNumber = Number.parseFloat(newNumber).toExponential(5);
            CurrentNumber.textContent = displayNumber;
        }
        else
        {
            CurrentNumber.textContent = newNumber;
            ApplyCommas();
        }
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


//operator key functions


function OperatorSelection(operator)
{
    var whichOperator = operator.target.className;

    if(whichOperator.match(/add/))
    {
        EquationLog.textContent = Number(RemoveCommas(CurrentNumber.textContent)) + ' + ';

        ApplyOperator('add');
    }
    else if(whichOperator.match(/subtract/))
    {
        EquationLog.textContent = Number(RemoveCommas(CurrentNumber.textContent)) + ' - ';

        ApplyOperator('subtract');
    }
    else if(whichOperator.match(/divide/))
    {
        EquationLog.textContent = Number(RemoveCommas(CurrentNumber.textContent)) + ' / ';

        ApplyOperator('divide');
    }
    else if(whichOperator.match(/multiply/))
    {
        EquationLog.textContent = Number(RemoveCommas(CurrentNumber.textContent)) + ' * ';

        ApplyOperator('multiply');
    }
}

function ApplyOperator(operator)
{
    //when on the first variable the operator is saved and placed on the log
    //when on the second variable the previous variable stays displayed
    //operators are still selectable until user input
    //after input operator keys trigger the previously saved operation
    if(EquationLog.textContent.includes(' / ') && CurrentNumber.textContent == '0')
    {
        alert('You cannot divide by zero!')
        return;
    }
    if(isNumberA)
    {
        numberA = Number(RemoveCommas(CurrentNumber.textContent));
        equationLog = [numberA, operator];
        isNumberA = false;
        isNumberB = true;
    }
    else if(isNumberB && numberB == null)
    {
        equationLog = [numberA, operator];
        numberResult = null;
    }
    else if(numberB == undefined)
    {
        console.log('error numberB undefined');
    }
    else
    {

        numberB = Number(RemoveCommas(CurrentNumber.textContent));
        numberResult = DoOperation(equationLog[1]);
        DecimalCheck(numberResult);
        if(hasDecimal)
        {
            numberResult = Number(numberResult.toFixed(2));
        }
        equationLog = [numberA, operator, numberB];
        numberB = null;
        numberA = numberResult;
        equationLog = [numberA, operator];
        if(numberA > 9999999999999 || numberA < -9999999999999 || hasDecimal && numberA.length > 12)
        {   
            var displayNumber = Number.parseFloat(numberA).toExponential(5);
            CurrentNumber.textContent = displayNumber;
            EquationLog.textContent = EquationLog.textContent.replace(/.*[\w]/g, displayNumber);
        }
        else
        {
            CurrentNumber.textContent = numberA;
            EquationLog.textContent = EquationLog.textContent.replace(/.*[\w]/g, numberA);
            ApplyCommas();
        }
    }
}

function DoOperation(operator)
{
    var result;
    
    if(operator.match(/add/))
    {
        result = numberA + numberB;
    }
    else if(operator.match(/subtract/))
    {
        result = numberA - numberB;
    }
    else if(operator.match(/divide/))
    {
        result = numberA / numberB;
    }
    else if(operator.match(/multiply/))
    {
        result = numberA * numberB;
    }

    return result;
}

function Enter()
{
    if(EquationLog.textContent.includes(' / ') && CurrentNumber.textContent == '0')
    {
        alert('You cannot divide by zero!')
        return;
    }
    
    if(isNumberB && Math.abs(RemoveCommas(CurrentNumber.textContent)) == Math.abs(numberResult))
    {        
        numberB = previousNumber;
        if(EquationLog.textContent.match(/^\-*\d*\.?\d+e[-+]?\d+/g))
        {
            console.log(EquationLog.textContent.match(/^\-*\d*\.?\d+e[-+]?\d+/g));
            EquationLog.textContent = EquationLog.textContent.replace(/^\-*\d*\.?\d+e[-+]?\d+/g, RemoveCommas(CurrentNumber.textContent) + ' ');
        }
        else
        {
            console.log(EquationLog.textContent.match(/^(\-*\d*,*[e\+\.\d]*)\s/));
            EquationLog.textContent = EquationLog.textContent.replace(/^(\-*\d*,*[e\+\.\d]*)\s/, RemoveCommas(CurrentNumber.textContent) + ' ');
        }
        
        numberResult = DoOperation(equationLog[1]);
        DecimalCheck(numberResult);
        if(hasDecimal)
        {
            numberResult = Number(numberResult.toFixed(2));
        }
        equationLog.push(numberB, ' = ');
        numberB = null;
        numberA = numberResult;
        if(numberA > 9999999999999 || numberA < -9999999999999 || hasDecimal && numberA.length > 12)
        {   
            var displayNumber = Number.parseFloat(numberA).toExponential(5);
            CurrentNumber.textContent = displayNumber;
            numberResult = displayNumber;
        }
        else
        {
            CurrentNumber.textContent = numberA;
            ApplyCommas();
        }

    }
    else if(isNumberB)
    {
        EquationLog.textContent = EquationLog.textContent + RemoveCommas(CurrentNumber.textContent) + ' = ';
        numberB = Number(RemoveCommas(CurrentNumber.textContent));
        numberResult = DoOperation(equationLog[1]);
        DecimalCheck(numberResult);
        if(hasDecimal)
        {
            numberResult = Number(numberResult.toFixed(2));
        }
        equationLog.push(numberB, ' = ');
        previousNumber = numberB;
        numberB = null;
        numberA = numberResult;
        
        if(numberA > 9999999999999 || numberA < -9999999999999 || hasDecimal && numberA.length > 12)
        {   
            var displayNumber = Number.parseFloat(numberA).toExponential(5);
            CurrentNumber.textContent = displayNumber;
            numberResult = displayNumber;
        }
        else
        {
            CurrentNumber.textContent = numberA;
            ApplyCommas();
        }

    }
    else if(isNumberA)
    {
        EquationLog.textContent = Number(RemoveCommas(CurrentNumber.textContent)) + ' = ';
    }
}


//math functions




//number key functions


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
    
    if(isNumberB && EquationLog.textContent.match(/=/))
    {
        CurrentNumber.textContent = input;
        EquationLog.textContent = '';
        numberA = 0;
        isNumberA = true;
        isNumberB = false;    
    }
    else if(isNumberB && numberB == null || isNumberB && numberB == '0')
    {
        CurrentNumber.textContent = input;
        numberB = CurrentNumber.textContent;
    }
    else if(CurrentNumber.textContent == '0')
    {
        CurrentNumber.textContent = input;
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


//erase key functions


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
    numberA = 0;
    numberB = null;
    isNumberB = false;
    isNumberA = true;
    CurrentNumber.textContent = '0';
    EquationLog.textContent = '';
    equationLog = [];
}

function ClearEach()
{
    isNumberA ? numberA = 0 : numberB = 0;
    CurrentNumber.textContent = '0';
}

function BackSpace()
{
    var content = CurrentNumber.textContent;
    if(content.match(/e/))
    {
        return;
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


//calculator assembly


const keypadNodelist = document.getElementsByClassName('numpad');
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
            const sqrtSymbol = document.createElement('div');
            sqrtSymbol.className = 'sqrt-symbol';
            sqrtSymbol.innerHTML = '&#x221a';
            keypadNodelist[i].textContent = '';
            keypadNodelist[i].appendChild(sqrtSymbol);
        }
        else if(currentKeyContentArr[i] == '<-')
        {
            const backspaceSymbol = document.createElement('div');
            backspaceSymbol.className = 'backspace-symbol';
            backspaceSymbol.innerHTML = '&#8592';
            keypadNodelist[i].textContent = '';
            keypadNodelist[i].appendChild(backspaceSymbol);
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
        else
        {
            keypadNodelist[i].addEventListener('click', ()=>ClearAll());
        }
    }
}


function sayHI()
{
    console.log('HI');
}

InsertKeyPadClasses();
InsertKeyPadContent();
InsertKeyPadFunctions();