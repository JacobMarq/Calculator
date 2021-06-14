const historyPanel = document.getElementById("history");
let isHistory = false;
const memoryPanel = document.getElementById("memory");
let isMemory = false;
const barOptionsPanel = document.getElementsByClassName("bar-options");
barOptionsPanel[0].addEventListener('click', function(){ToggleOptionsPanel();});
const dropDownHamburger = document.getElementsByClassName('dropdown-toggle');
dropDownHamburger[0].addEventListener('click', function(){ToggleDropDown();});
const dropDownMenu = document.getElementById('dialog-container');
let isDropDownActive = false;
const modeSelections = document.getElementsByClassName('selection');
const currentMode = document.getElementById('dropdown-selection');

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

function ChangeMode(e)
{
    for(i=0; i<modeSelections.length; i++){
        modeSelections[i].classList.remove('current');
    } 

    console.log(e.target.id, 'set');
    currentMode.textContent = (e.target.id);
    e.target.classList.add('current');
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
