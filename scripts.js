
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

let numberA = 0;
let numberB = 4;
let isNumberB = false;
let numberResult = null;
let equationLog = null;
console.log(numberA - numberB);


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
        return;
    }else{
        if(typeConverterArray.includes(selection)){
            console.log('type', 'Converter');
        }
        else{
            calculatorType.classList.add(selection);
            console.log('type', 'Calculator');
        }
    }
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
