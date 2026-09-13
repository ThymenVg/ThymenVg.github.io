alert("IMPORTANT: reloading the page will restart the Wordle");
const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',];
var divArray = [];
var divArrayLetters = [];
let wordsArray = [];
let counter = 0;
let toGuess = "";

fetch('words.txt')
    .then(response => response.text())
    .then(data => {
        wordsArray = data.trim().split('\n');
        const randomNumber = Math.floor(Math.random() * wordsArray.length);
        start(wordsArray[randomNumber]); 
});

function handleButtonClick(){
    if(document.querySelector("button").innerText == "RESTART"){
        document.querySelector("input").value = "";
        location.reload();  
    } 
    if(document.querySelector("input").value == "")alert("WARNING: empty textbox");
    else guess(document.querySelector("input").value);
}

function guess(word){
    let inWordList = false;
    for(var i = 0; i < wordsArray.length; i++){
        if(word.toUpperCase() == wordsArray[i].trim().toUpperCase()) inWordList = true;
    }
    if(!inWordList){
        alert("WARNING: word not in list");
        document.querySelector("input").value = "";
    } else {
        word = word.toUpperCase().trim();
        document.querySelector("input").value = "";
        if(word.length == 5) {
            counter++;
             for (var i = 0; i < 5; i++){
                if (toGuess[i] == word[i]){
                    divArray[counter-2][i].classList.add("green");
                    checkLetters(word[i], "green", "grey", "yellow");
                }
                else if (toGuess.includes(word[i])){ 
                    divArray[counter-2][i].classList.add("yellow");
                    checkLetters(word[i], "yellow", "grey", "green");
                }
                else{
                     divArray[counter-2][i].classList.add("grey");
                     checkLetters(word[i], "grey", "yellow", "green");
                }
                divArray[counter-2][i].innerText = word[i];
            }
            checkEnd();
        } else alert("WARNING: incorrect word length, length needs to be: 5");
    }
}

function checkEnd(){
    let won = true;
    for (var i = 0; i < 5; i++) {
        if(divArray[counter-2][i].classList.contains("grey") || divArray[counter-2][i].classList.contains("yellow")) won = false;
    }
    if(won || counter == 7){
        document.querySelector("input").value = toGuess;
        document.querySelector("input").disabled = true;
        document.querySelector("button").innerText = "RESTART";
    }
}

function start(word){
    counter++;
    toGuess = word.toUpperCase();
    document.querySelector("input").value = "";
    createDivs(6,5,divArray, 'container', 'box', false);
    createDivs(13,2,divArrayLetters, 'containerLetters', 'boxLetters', true);
}

function createDivs(n, m, arr, classContainer, classDiv, letters){
    for (var i = 0; i < n; i++) {
        arr[i] = [];
        for (var j = 0; j < m; j++) {
            var divElement = document.createElement('div');  
            divElement.className = classDiv; 
            arr[i][j] = divElement; 
        }
    }

    var container = document.getElementById(classContainer);
    for (var i = 0; i < n; i++) {
        for (var j = 0; j < m; j++) {
            container.appendChild(arr[i][j]);
            if(letters) arr[i][j].innerText = alphabet[i*2+j];
        }
        container.appendChild(document.createElement('br'));
    }
}

function checkLetters(letter, colorClass, colorClassRm, colorClassRm2){
    for(var i = 0; i < 13; i++){
        for(var j = 0; j < 2; j++){
            if(letter == divArrayLetters[i][j].innerText){
                divArrayLetters[i][j].classList.add(colorClass);
                divArrayLetters[i][j].classList.remove(colorClassRm);
                divArrayLetters[i][j].classList.remove(colorClassRm2);
            }  
        }
    }
}