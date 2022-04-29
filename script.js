/*
Impossible Tic-Tac-Toe
by Peyton Bechard

Created: 29 Apr 2022
Last Updated: 29 Apr 2022
*/

/*
SPECIFICATIONS

GAME FLOW
Player goes first.
Player chooses a spot on the grid - a marker is placed there.
Bot chooses a spot on the grid - a marker is placed there.
This continues until one gets 3 in a row (horizontally, vertically, 
    or diagonally) or until all spaces are filled.
Result message is shown (with line or other visual showing 3-in-a-row if achieved)
Loser goes first next game or same player goes first if draw.

ADDITIONAL NOTES
Player has options to:
    - switch marker between X and O
        - player can switch markers mid-game
    - adjust difficulty (i.e. frequency of AI algorithm usage)
        - player can adjust difficulty mid-game
    - restart current game
    - play again after result is shown.

OBJECTS
GameFlow - manages game progression
GameOptions - manages settings
GameGrid - tracks marker positions
Player - manages player functionalities
AI - manages bot player moves
*/

const GameGrid = (() => {
    let gameBoard = ['','','','','','','','',''];
    const getGameBoard = () => gameBoard;

    let markerCount = 0;
    const getMarkerCount = () => markerCount;

    const addMarker = (value) => {
        let marker = GameOptions.getPlayerMarker();
        if (GameFlow.isPlayerTurn()) {
            marker = GameOptions.getPlayerMarker();
        } else {
            marker = GameOptions.getAIMarker();
        }
        gameBoard[value] = marker;
        const slot = document.getElementById(`box-${value}`);
        slot.classList.add('disabled');
        markerCount++;
        updateDisplay();
    };

    const updateDisplay = () => {
        for (let i = 0; i < gameBoard.length; i++) {
            const slot = document.getElementById(`box-${i}`);
            slot.textContent = gameBoard[i];
        }
    };    

    const reset = () => {
        const gameGrid = document.querySelectorAll('.game-grid div');
        gameGrid.forEach( (slot) => slot.classList.remove('disabled') );
        gameBoard.fill('');
        markerCount = 0;
        updateDisplay();
    }

    return { addMarker, getGameBoard, getMarkerCount, reset };
})();

const GameOptions = (() => {
    let playerMarker = 'X';
    let AIMarker = 'O';

    const getPlayerMarker = () => playerMarker;
    const getAIMarker = () => AIMarker;

    const swapMarkers = () => {
        if (playerMarker === 'X') {
            playerMarker = 'O';
            AIMarker = 'X';
        } else {
            playerMarker = 'X';
            AIMarker = 'O';
        }
        GameGrid.reset();
    };

    const getDifficultySetting = () => difficulty.value;

    const swapMarkersButton = document.querySelector('.switch');
    swapMarkersButton.addEventListener('click', () => swapMarkers());

    const difficulty = document.querySelector('#difficulty');

    const restartButton = document.getElementById('restart');
    restartButton.addEventListener('click', () => GameGrid.reset());

    return { getPlayerMarker, getAIMarker, getDifficultySetting };
})();

const Player = (() => {
    const gameGrid = document.querySelectorAll('.game-grid div');
    let choice = null;
    gameGrid.forEach( (slot) => {
        slot.addEventListener('click', () => {
            choice = slot.getAttribute('value');
            makeMove();
        });
    });

    const getUserChoice = () => { choice };

    const makeMove = () => {
        if (GameFlow.isPlayerTurn() && GameFlow.isGameOn() && choice) {
            GameGrid.addMarker(choice);
            choice = null;
            GameFlow.checkResult();
            if (GameFlow.isGameOn()) {
                AI.makeMove();
            }
        }
    };

    return { getUserChoice };
})();

const AI = (() => {
    const gameBoard = GameGrid.getGameBoard();

    const makeMove = () => {
        if (!GameFlow.isPlayerTurn()) {
            let random = parseInt(Math.random() * 9);
            while (gameBoard[random] !== '') {
                random = parseInt(Math.random() * 9);
            }
            GameGrid.addMarker(random);
        }
        GameFlow.checkResult();
    };
    return { makeMove };
})();

const GameFlow = (() => {
    // rungame
    // player move
    // check result
    // bot move
    // check result
    // ...
    // if result, game finished

    const gameBoard = GameGrid.getGameBoard();
    const markerCount = GameGrid.getMarkerCount();
    let playerTurn = true;
    let gameOn = true;

    const isPlayerTurn = () => playerTurn;
    const isGameOn = () => gameOn;


    const checkResult = () => {
        if (gameBoard[0] === gameBoard[1] && gameBoard[0] === gameBoard[2] && gameBoard[0]) {
            showResult(0, 1, 2);
            gameOn = false;
        } else if (gameBoard[3] === gameBoard[4] && gameBoard[3] === gameBoard[5] && gameBoard[3]) {
            showResult(3, 4, 5);
            gameOn = false;
        } else if (gameBoard[6] === gameBoard[7] && gameBoard[6] === gameBoard[8] && gameBoard[6]) {
            showResult(6, 7, 8);
            gameOn = false;
        } else if (gameBoard[0] === gameBoard[3] && gameBoard[0] === gameBoard[6] && gameBoard[0]) {
            showResult(0, 3, 6);
            gameOn = false;
        } else if (gameBoard[1] === gameBoard[4] && gameBoard[1] === gameBoard[7] && gameBoard[1]) {
            showResult(1, 4, 7);
            gameOn = false;
        } else if (gameBoard[2] === gameBoard[5] && gameBoard[2] === gameBoard[8] && gameBoard[2]) {
            showResult(2, 5, 8);
            gameOn = false;
        } else if (gameBoard[0] === gameBoard[4] && gameBoard[0] === gameBoard[8] && gameBoard[0]) {
            showResult(0, 4, 8);
            gameOn = false;
        } else if (gameBoard[2] === gameBoard[4] && gameBoard[2] === gameBoard[6] && gameBoard[2]) {
            showResult(2, 4, 6);
            gameOn = false;
        } else if (markerCount === 9) {
            console.log('draw');
            gameOn = false;
        } 
        playerTurn = !playerTurn;
    };

    const showResult = (a, b, c) => {
            // highlight winning choices
            // disable all slots
            // show result message
            // pulse restart button
            console.log(`${gameBoard[a]} wins`);
    };

    return { isPlayerTurn, checkResult, isGameOn };
})();
