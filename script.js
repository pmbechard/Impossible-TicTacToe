/*
Impossible Tic-Tac-Toe
by Peyton Bechard

Created: 29 Apr 2022
Last Updated: 1 May 2022
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


TO DO:
    - Fix minimax algorithm and reinstate 'Impossible' difficulty level
    - Add media queries for responsive design


KNOWN BUGS
    - Player can still win with sequences:
        0, 8, 6, 7
        8, 0, 6, 7
        6, 2, 8, 7
        2, 6, 8, 5
        2, 6, 8, 7

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
        gameGrid.forEach( (slot) => {
            slot.classList.remove('disabled');
            slot.style.backgroundColor = '';
        });
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
        gameBoard = GameGrid.getGameBoard();
        const playerFirst = gameBoard.filter( (slot) => slot !== '').length % 2 === 0;
        if (playerFirst === false) {
            GameFlow.checkResult();
        }
        const restartButton = document.getElementById('restart');
        restartButton.click();
    };

    const getDifficultySetting = () => difficulty.value;

    const swapMarkersButton = document.querySelector('.switch');
    swapMarkersButton.addEventListener('mouseup', () => swapMarkers());

    return { getPlayerMarker, getAIMarker, getDifficultySetting };
})();

const Player = (() => {
    const gameGrid = document.querySelectorAll('.game-grid div');
    let choice = null;
    gameGrid.forEach( (slot) => {
        slot.addEventListener('click', () => {
            if (GameFlow.isGameOn()) {
                choice = slot.getAttribute('value');
                if (slot.textContent === '') {
                    makeMove();
                }
            }
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
            choice = null;
        }
    };

    return { makeMove };
})();

const AI = (() => {
    const gameBoard = GameGrid.getGameBoard();

    const makeMove = () => {
        if (!GameFlow.isPlayerTurn()) {
            // Decision to use Random or Logical Choice
            const difficulty = GameOptions.getDifficultySetting();
            let decisionFactor = 0;
            /* 
                Reinstate the following code block when minimax algorithm is working as expected
            */
            // if (difficulty === 'easy') {
            //     decisionFactor = 0;
            // } else if (difficulty === 'medium') {
            //     decisionFactor = 33;
            // } else if (difficulty === 'hard') {
            //     decisionFactor = 66;
            // } else if (difficulty === 'impossible') {
            //     decisionFactor = 100;
            // }
            if (difficulty === 'easy') {
                decisionFactor = 0;
            } else if (difficulty === 'medium') {
                decisionFactor = 50;
            } else if (difficulty === 'hard') {
                decisionFactor = 100;
            }
            const decision = Math.random() * 101;
            if (decision >= decisionFactor) {
                randomChoice();
            } else {
                logicalChoice();
            }
        }
    };

    const randomChoice = () => {
        let random = parseInt(Math.random() * 9);
        while (gameBoard[random] !== '') {
            random = parseInt(Math.random() * 9);
        }
        GameGrid.addMarker(random);
        GameFlow.checkResult();
    };

    const logicalChoice = () => {
        const gameBoard = GameGrid.getGameBoard();
        const equals = (a, b) => JSON.stringify(a) === JSON.stringify(b);
        
        // Band-aid for center starter if player goes first
        if (gameBoard.filter( (item) => item !== '').length === 1) {
            if (gameBoard[4] === '') {
                GameGrid.addMarker(4);
                GameFlow.checkResult();
            } else {
                GameGrid.addMarker(0);
                GameFlow.checkResult();
            }
        
        // Band-aid for player winning method sequence: 4, 8, 2, 6
        } else if (equals(gameBoard,[GameOptions.getAIMarker(), '', '', '', GameOptions.getPlayerMarker(), '', '', '', GameOptions.getPlayerMarker()])) {
            GameGrid.addMarker(5);
            GameFlow.checkResult();
        } else {
            let bestVal = -1000;
            let bestMove = NaN;
            
            for (let i = 0; i < gameBoard.length; i++) {
                if (gameBoard[i] === '') {
                    let moveVal;
                    if (!GameFlow.isPlayerFirst()) {
                        gameBoard[i] = GameOptions.getAIMarker();
                        moveVal = minimax(gameBoard, 0, false);
                    } else {
                        gameBoard[i] = GameOptions.getPlayerMarker();
                        moveVal = minimax(gameBoard, 0, true);
                    }

                    gameBoard[i] = '';
    
                    if (moveVal > bestVal) {
                        bestVal = moveVal;
                        bestMove = i;
                    }
                }
            }
            GameGrid.addMarker(bestMove);
            GameFlow.checkResult();
        }

        
    };

    const minimax = (board, depth, isMax) => {
        if (isMovesLeft(board) === 0) {return 0;}
        let score = evaluate(board);
        if (score > 0) {
            return score - depth;
        } else if (score < 0) {
            return score + depth;
        }

        if (isMax) {
            let value = -Infinity;
            for (let i = 0; i < board.length; i++) {
                if (board[i] === '') {
                    if (!GameFlow.isPlayerFirst()) {
                        board[i] = GameOptions.getAIMarker();
                    } else {
                        board[i] = GameOptions.getPlayerMarker();
                    }
                    value = Math.max(value, minimax(board, depth - 1, false) - depth);
                    board[i] = '';
                }
            }
            return value;
        } else {
            let value = Infinity;
            for (let i = 0; i < board.length; i++) {
                if (board[i] === '') {
                    if (!GameFlow.isPlayerFirst()) {
                        board[i] = GameOptions.getPlayerMarker();
                    } else {
                        board[i] = GameOptions.getAIMarker();
                    }
                    value = Math.min(value, minimax(board, depth - 1, true) + depth);
                    board[i] = '';
                }
            }
            return value;
        }
    };

    const isMovesLeft = (board) => {
        let counter = 0;
        for (let item in board) {
            if (item !== '') {
                counter += 1;
            }
        }
        return counter;
    };

    const evaluate = (board) => {
        if (board[0] === board[1] && board[0] === board[2] && board[0]) {
            if (GameOptions.getAIMarker() === board[0]){
                return 10;
            } else {
                return -10;
            }
        } else if (board[3] === board[4] && board[3] === board[5] && board[3]) {
            if (GameOptions.getAIMarker() === board[3]){
                return 10;
            } else {
                return -10;
            }
        } else if (board[6] === board[7] && board[6] === board[8] && board[6]) {
            if (GameOptions.getAIMarker() === board[6]){
                return 10;
            } else {
                return -10;
            }
        } else if (board[0] === board[3] && board[0] === board[6] && board[0]) {
            if (GameOptions.getAIMarker() === board[0]){
                return 10;
            } else {
                return -10;
            }
        } else if (board[1] === board[4] && board[1] === board[7] && board[1]) {
            if (GameOptions.getAIMarker() === board[1]){
                return 10;
            } else {
                return -10;
            }
        } else if (board[2] === board[5] && board[2] === board[8] && board[2]) {
            if (GameOptions.getAIMarker() === board[2]){
                return 10;
            } else {
                return -10;
            }
        } else if (board[0] === board[4] && board[0] === board[8] && board[0]) {
            if (GameOptions.getAIMarker() === board[0]){
                return 10;
            } else {
                return -10;
            }
        } else if (board[2] === board[4] && board[2] === board[6] && board[2]) {
            if (GameOptions.getAIMarker() === board[2]){
                return 10;
            } else {
                return -10;
            }
        } else {
            return 0;
        } 
    }

    return { makeMove };
})();

const GameFlow = (() => {
    const gameBoard = GameGrid.getGameBoard();
    let markerCount = GameGrid.getMarkerCount();
    let playerTurn = true;
    let gameOn = true;
    let playerFirst = true;

    const isPlayerTurn = () => playerTurn;
    const isGameOn = () => gameOn;
    const isPlayerFirst = () => playerFirst;


    const checkResult = () => {
        markerCount++;
        if (gameBoard[0] === gameBoard[1] && gameBoard[0] === gameBoard[2] && gameBoard[0]) {
            showResult(0, 1, 2);
        } else if (gameBoard[3] === gameBoard[4] && gameBoard[3] === gameBoard[5] && gameBoard[3]) {
            showResult(3, 4, 5);
        } else if (gameBoard[6] === gameBoard[7] && gameBoard[6] === gameBoard[8] && gameBoard[6]) {
            showResult(6, 7, 8);
        } else if (gameBoard[0] === gameBoard[3] && gameBoard[0] === gameBoard[6] && gameBoard[0]) {
            showResult(0, 3, 6);
        } else if (gameBoard[1] === gameBoard[4] && gameBoard[1] === gameBoard[7] && gameBoard[1]) {
            showResult(1, 4, 7);
        } else if (gameBoard[2] === gameBoard[5] && gameBoard[2] === gameBoard[8] && gameBoard[2]) {
            showResult(2, 5, 8);
        } else if (gameBoard[0] === gameBoard[4] && gameBoard[0] === gameBoard[8] && gameBoard[0]) {
            showResult(0, 4, 8);
        } else if (gameBoard[2] === gameBoard[4] && gameBoard[2] === gameBoard[6] && gameBoard[2]) {
            showResult(2, 4, 6);
        } else if (markerCount === 9) {
            showResult(-1);
        } 
        playerTurn = !playerTurn;
    };

    const showResult = (a, b, c) => {
            gameOn = false;
            const gameGrid = document.querySelectorAll('.game-grid div');

            if (a < 0) {
                gameGrid.forEach( (slot) => {
                    slot.removeEventListener('click', ({}) );
                    slot.style.backgroundColor = 'rgba(247, 235, 7, 0.5)';
                    });
            }

            gameGrid.forEach( (slot) => {
                slot.removeEventListener('click', ({}) );
                if ([`box-${a}`, `box-${b}`, `box-${c}`].includes(slot.id)) {
                    if (GameOptions.getPlayerMarker() === gameBoard[a]) {
                        slot.style.backgroundColor = 'rgba(19, 114, 19, 0.5)';
                    } else {
                        slot.style.backgroundColor = 'rgba(185, 40, 40, 0.5)';
                    }
                } 
            });
            
            const restartButton = document.getElementById('restart');
            restartButton.classList.add('pulse');
    };

    const restartButton = document.getElementById('restart');
    restartButton.addEventListener('click', () => {
        gameOn = true;
        markerCount = 0;
        restartButton.classList.remove('pulse');
        GameGrid.reset();
        if (!playerTurn) {
            playerFirst = false;
            AI.makeMove()
        } else {
            playerFirst = true;
        }
        Player.makeMove();
    });

    return { isPlayerTurn, isPlayerFirst, checkResult, isGameOn };
})();