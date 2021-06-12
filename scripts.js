const historyPanel = document.getElementById("history");
let isHistory;
const memoryPanel = document.getElementById("memory");
var isMemory;
const barOptionsPanel = document.getElementsByClassName("bar-options");

barOptionsPanel[0].addEventListener('click', function(){
    isHistory = historyPanel.style.display == 'inline-block';
    isMemory = memoryPanel.style.display == 'inline-block';
    //isHistory = historyPanel.style.transform == 0;
    //isMemory = memoryPanel.style.transform == 0;
    historyPanel.style.display = isHistory ? 'none' : 'inline-block';
    historyPanel.setAttribute('class', isHistory ? 'slide-out' : 'slide-in');
    memoryPanel.style.display = isMemory ? 'none' : 'inline-block';
    memoryPanel.setAttribute('class', isMemory ? 'slide-out' : 'slide-in');
    
    console.log(isHistory, isMemory);
});

historyPanel.style.display = 'inline-block';
historyPanel.style.display = isHistory ? 'none' : 'inline-block';
historyPanel.setAttribute('class', isHistory ? 'slide-out' : 'slide-in');


//memoryPanel.style.display = 'inline-block';
//isHistory = historyPanel.style.transform == 0;
//isMemory = memoryPanel.style.transform == 0;


isHistory = historyPanel.style.display == 'inline-block';
isMemory = memoryPanel.style.display == 'inline-block';
console.log(isHistory, isMemory);