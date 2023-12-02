class Game {
    constructor(guessList, wordList) {
        this.guessList = guessList;
        this.wordList = wordList;
        this.word = "";
        this.row = 0; //current guess (attempt #)
        this.col = 0; //current letter for that attempt
    }

    popupClick(popupname){
        var infoContainer = document.getElementById(popupname);
        var popups = document.getElementsByClassName('popup');
        for (var i = 0; i < popups.length; i++) {
            popups[i].style.display = "none";
        }    infoContainer.style.display = "block";
    }

    showPopup(popupName) {
        const infoContainer = document.getElementById(popupName);
        const popups = document.getElementsByClassName('popup');
        for (let i = 0; i < popups.length; i++) {
            popups[i].style.display = "none";
        }
        infoContainer.style.display = "block";
    }

    chooseWord() {
        this.word = this.wordList[Math.floor(Math.random() * this.wordList.length)].toUpperCase();
        console.log(this.word);
    }

    start() {
        this.chooseWord();
        document.addEventListener("DOMContentLoaded", () => {
            this.updateDateTime();
            this.chooseWord();
        });
    }

    updateDateTime() {
        var dateTimeElement = document.getElementById('date-time');
        var currentDate = new Date();
        var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        var formattedDateTime = months[currentDate.getMonth()] + ' ' + currentDate.getDate() + ', ' + currentDate.getFullYear();
        dateTimeElement.textContent = formattedDateTime;
    }

    processInput(e) {
        if (gameOver) return; 
    
        // alert(e.code);
        if ("KeyA" <= e.code && e.code <= "KeyZ") {
            if (this.col < width) {
                let currTile = document.getElementById(this.row.toString() + '-' + this.col.toString());
                if (currTile.innerText == "") {
                    currTile.innerText = e.code[3];
                    this.col += 1;
                }
            }
        }
        else if (e.code == "Backspace") {
            if (0 < this.col && this.col <= width) {
                this.col -=1;
            }
            let currTile = document.getElementById(this.row.toString() + '-' + this.col.toString());
            currTile.innerText = "";
        }
    
        else if (e.code == "Enter") {
            this.update();
        }
    
        if (!gameOver && this.row == height) {
            gameOver = true;
            this.endGameLose();
        }
    }

    update() {
        let guess = "";
    
        for (let c = 0; c < width; c++) {
            let currTile = document.getElementById(this.row.toString() + '-' + c.toString());
            let letter = currTile.innerText;
            guess += letter;
        }
    
        guess = guess.toLowerCase(); //case sensitive
        console.log(guess);
    
        if (!guessList.includes(guess)) {
            this.wordNotFoundPopup();
            return;
        }
        
        //start processing guess
        let correct = 0;
    
        let letterCount = {}; //keep track of letter frequency, ex) KENNY -> {K:1, E:1, N:2, Y: 1}
        for (let i = 0; i < this.word.length; i++) {
            let letter = this.word[i];
    
            if (letterCount[letter]) {
               letterCount[letter] += 1;
            } 
            else {
               letterCount[letter] = 1;
            }
        }
    
        console.log(letterCount);
    
        //first iteration, check all the correct ones first
        for (let c = 0; c < width; c++) {
            let currTile = document.getElementById(this.row.toString() + '-' + c.toString());
            currTile.classList.add("animation");
            let letter = currTile.innerText;
    
            //Is it in the correct position?
            if (this.word[c] == letter) {
                currTile.classList.add("correct");
    
                let keyTile = document.getElementById("Key" + letter);
                keyTile.classList.remove("present");
                keyTile.classList.add("correct");
    
                correct += 1;
                letterCount[letter] -= 1; //deduct the letter count
            }
    
            if (correct == width) {
                gameOver = true;
                this.endGameWin();
            }
        }
    
        console.log(letterCount);
        for (let c = 0; c < width; c++) {
            let currTile = document.getElementById(this.row.toString() + '-' + c.toString());
            let letter = currTile.innerText;
    
            
            if (!currTile.classList.contains("correct")) {
                if (this.word.includes(letter) && letterCount[letter] > 0) {
                    currTile.classList.add("present");
                    
                    let keyTile = document.getElementById("Key" + letter);
                    if (!keyTile.classList.contains("correct")) {
                        keyTile.classList.add("present");
                    }
                    letterCount[letter] -= 1;
                }
                else {
                    currTile.classList.add("absent");
                    let keyTile = document.getElementById("Key" + letter);
                    keyTile.classList.add("absent")
                }
            }
        }
    
        this.row += 1;
        this.col = 0;
    }

    processKey() {
        e = { "code" : this.id };
        this.processInput(e);
    }
    
    intializeBoard(){
        var mainContainerDiv = document.createElement("div");
        mainContainerDiv.classList.add("container");
        mainContainerDiv.id = "main-container";

        var boardDiv = document.createElement("div");
        boardDiv.id = "board";
        var keyboardDiv = document.createElement("div");
        keyboardDiv.id = "keyboard";

        // Dodawanie elementów do diva o id="main-container"
        mainContainerDiv.appendChild(boardDiv);
        mainContainerDiv.appendChild(keyboardDiv);

        var gamePanel = document.getElementById("gamePanel");
        gamePanel.appendChild(mainContainerDiv);

        for (let r = 0; r < height; r++) {
            for (let c = 0; c < width; c++) {
                let tile = document.createElement("span");
                tile.id = r.toString() + "-" + c.toString();
                tile.classList.add("tile");
                tile.innerText = "";
                document.getElementById("board").appendChild(tile);
            }
        }
        let keyboard = [
            ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
            ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
            ["Enter", "Z", "X", "C", "V", "B", "N", "M", "⌫" ]
        ]
    
        for (let i = 0; i < keyboard.length; i++) {
            let currRow = keyboard[i];
            let keyboardRow = document.createElement("div");
            keyboardRow.classList.add("keyboard-row");
    
            for (let j = 0; j < currRow.length; j++) {
                let keyTile = document.createElement("div");
    
                let key = currRow[j];
                keyTile.innerText = key;
                if (key == "Enter") {
                    keyTile.id = "Enter";
                }
                else if (key == "⌫") {
                    keyTile.id = "Backspace";
                }
                else if ("A" <= key && key <= "Z") {
                    keyTile.id = "Key" + key; // "Key" + "A";
                } 
                keyTile.addEventListener("click", this.processKey);
    
                if (key == "Enter") {
                    keyTile.classList.add("enter-key-tile");
                } else {
                    keyTile.classList.add("key-tile");
                }
                keyboardRow.appendChild(keyTile);
            }
            document.getElementById('keyboard').appendChild(keyboardRow);
        }
        document.addEventListener("keyup", (e) => {
            this.processInput(e);
        })
    }
    createPopup() {
        let newpopup = document.createElement("div");
        newpopup.id = "answer";
        var mainContainer = document.getElementById("main-container");
        mainContainer.appendChild(newpopup);
        return newpopup;
    }
    wordNotFoundPopup(){
        let wordNotFoundPopup = this.createPopup();
        wordNotFoundPopup.style.display = 'block';
        wordNotFoundPopup.classList.add("lose");
        wordNotFoundPopup.innerText = "word not in wordlist";
        setTimeout(function(){
            wordNotFoundPopup.style.display = 'none';
        }, 3000);
    }
    endGameWin(){
        let winPopup = this.createPopup();
        winPopup.classList.add("win");
        winPopup.innerText = "genius";
        setTimeout(function () {
            this.popupClick('stats-popup');
        }, 3000); 
    }
    endGameLose(){
        let losePopup = this.createPopup();
        losePopup.classList.add("lose");
        losePopup.innerText = this.word;
        setTimeout(function () {
            this.popupClick('stats-popup');
        }, 3000); 
    }

}
  
function startGame(){
    document.getElementById('menu-container').style.display = "none";
    var navbar = document.getElementById('gamePanel');
    navbar.style.display = "block";
    game.intializeBoard();
}

// var guessList = ["sport", "style", "stare", "swift", "share"];
// var wordList = ["style"];


var height = 6; //number of guesses
var width = 5; //length of the word

var gameOver = false;

const game = new Game(guessList, wordList);
game.start();