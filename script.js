alert("IMPORTANT: reloading the page will restart the Wordle");
var divArray = [];
let counter = 0;
let toGuess = "";
let wordLength = "";

function handleButtonClick(){
    if(document.querySelector("button").innerText == "RESTART"){
        document.querySelector("input").value = ""
        location.reload();  
    } 
    if(document.querySelector("input").value == "")alert("WARNING: empty textbox");
    else if(counter === 0) start(document.querySelector("input").value);
    else guess(document.querySelector("input").value);
}

function guess(word){
    word = word.toUpperCase().split(" ").join("");
    document.querySelector("input").value = "";
    if(word.length == wordLength) {
        counter++;
        for (var i = 0; i < wordLength; i++){
            if (toGuess[i] == word[i])
                divArray[counter-2][i].classList.add("green");
            else if (toGuess.includes(word[i]))               
                divArray[counter-2][i].classList.add("yellow");
            else divArray[counter-2][i].classList.add("grey");
            divArray[counter-2][i].innerText = word[i];
        }
        checkEnd();
    } else alert("WARNING: incorrect word length, length needs to be: " +wordLength);
}

function checkEnd(){
    let won = true;
    for (var i = 0; i < wordLength; i++) {
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
    toGuess = document.querySelector("input").value.toUpperCase().split(" ").join("");
    document.querySelector("input").value = "";
    document.querySelector("button").innerText = "GUESS";

    wordLength = toGuess.length;

    for (var i = 0; i < 6; i++) {
        divArray[i] = [];
        for (var j = 0; j < wordLength; j++) {
            var divElement = document.createElement('div'); 
            divElement.className = 'box'; 
            divArray[i][j] = divElement; 
        }
    }

    var container = document.getElementById('container');
    for (var i = 0; i < 6; i++) {
        for (var j = 0; j < wordLength; j++) {
            container.appendChild(divArray[i][j]);
        }
        container.appendChild(document.createElement('br'));
    }
}
