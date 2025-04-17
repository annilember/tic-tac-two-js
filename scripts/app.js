import { createGameModeContainer, createBoard, updateCell, updateGridState, drawWinningCells } from "./ui.js";
import { GameBrain } from "./game.js";
import { Timer } from "./timer.js";

console.log("app.js is running!");

let content = document.createElement("div");
content.classList.add("content");

let h1 = document.createElement("h1");
h1.innerHTML = "Tic-Tac-Two";
content.appendChild(h1);

let game = new GameBrain();

let timer = new Timer();
content.appendChild(timer.element);

function startGame(gameModeName) {
    gameModeContainer.style.display = "none";
    game.setGameMode(gameModeName);
    timer.start();
    gameContainer.style.display = "block";
}

let gameModeContainer = createGameModeContainer(startGame);
content.appendChild(gameModeContainer);

function aiMove() {
    const aiMoveInfo = game.aiMoveInfo;
    const thinkingDelay = Math.floor(Math.random() * 1000) + 500;
    const humanIsThinking = document.querySelector(".humans-turn");
    humanIsThinking.style.display = "none";
    const aiIsThinking = document.querySelector(".ais-turn");
    aiIsThinking.style.display = "block";

    console.log(`AI move info: {x: ${aiMoveInfo.x}, y: ${aiMoveInfo.y}}, Rx: ${aiMoveInfo.removedX}, Ry: ${aiMoveInfo.removedY}, MG: ${aiMoveInfo.movedGrid}}}`)

    setTimeout(() => {
        if (aiMoveInfo.movedGrid) updateGridState(game.grid, game.movableGrid);
        else if (Number.isFinite(aiMoveInfo.removedX)) updateCell(game.board, aiMoveInfo.removedX, aiMoveInfo.removedY);
        updateCell(game.board, aiMoveInfo.x, aiMoveInfo.y);
        humanIsThinking.style.display = "block";
        aiIsThinking.style.display = "none";
        updateTurnMessages();
        handleGameOver();
    }, thinkingDelay);
}

function updateTurnMessages() {
    document.querySelector(".current-player").textContent = game.currentPlayer;
}

function handleGameOver() {
    if (game.gameOver) {
        timer.stop();
        let container = document.querySelector(".info");
        document.querySelector(".whos-turn").style.display = "none";
        drawWinningCells(game.winner);
        let message = document.createElement("h1");
        message.classList.add("game-over-text");
        message.innerHTML = "GAME OVER";
        container.appendChild(message);
    }
}

function cellUpdate(x, y) {
    if (!game.gameOver) {
        game.makeAMove(x, y);
        updateTurnMessages();
        updateCell(game.board, x, y);
        updateGridState(game.grid, game.movableGrid);
        if (game.aiMadeAMove) aiMove();
        else handleGameOver();
    }
}

function gridMove(event) {
    if (!game.gameOver) {
        game.moveGrid(event);
        updateTurnMessages();
        updateGridState(game.grid, game.movableGrid);
        if (game.aiMadeAMove) aiMove();
        else handleGameOver();
    }
}

document.addEventListener("keyup", (e) => { gridMove(e) });

let gameContainer = document.createElement("div");
gameContainer.classList.add("play-game");

let boardContainer = document.createElement("div");
boardContainer.classList.add("board-container");
let board = createBoard(game.board, game.grid, cellUpdate);
boardContainer.appendChild(board);
gameContainer.appendChild(boardContainer);

let info = document.createElement("div");
info.classList.add("info");

let whosTurnContainer = document.createElement("div");
whosTurnContainer.classList.add("whos-turn");
let humansTurn = document.createElement("h4");
humansTurn.classList.add("humans-turn");
let humanSpan = document.createElement("span");
humanSpan.classList.add("current-player");
humanSpan.innerHTML = game.currentPlayer;
humansTurn.append(humanSpan);
humansTurn.append(": Human, make your move.");

let aisTurn = document.createElement("h4");
aisTurn.classList.add("ais-turn");
aisTurn.append("O: AI is thinking...");
let spinner = document.createElement("span");
spinner.classList.add("spinner");
aisTurn.appendChild(spinner);

whosTurnContainer.appendChild(humansTurn);
whosTurnContainer.appendChild(aisTurn);
info.appendChild(whosTurnContainer);

gameContainer.appendChild(info);

let resetButton = document.createElement("button");
resetButton.innerHTML = "Reset Game";
resetButton.addEventListener("click", () => { location.reload(); });
gameContainer.appendChild(resetButton);

content.appendChild(gameContainer);

let rules = document.createElement("div");
rules.classList.add("rules-container");

let rulesHeading = document.createElement("h2");
rulesHeading.innerHTML = `RULES`

let rulesText = document.createElement("div");

let rulesIntroText = document.createElement("p");
rulesIntroText.innerHTML = `
The game is similar to tic-tac-toe, but has a few modifications. Each player has 4 pieces. X starts. Play with a friend or against AI.`;
rulesText.append(rulesIntroText);

let turnHeading = document.createElement("h3");
turnHeading.innerHTML = `TURN`;
rulesText.append(turnHeading);

let turnOptions1 = document.createElement("p");
turnOptions1.innerHTML = `1. Player places a piece on the board.`;
rulesText.append(turnOptions1);

let turnOptionsAdditional = document.createElement("p");
turnOptionsAdditional.innerHTML = `After both players have placed 2 pieces, additional move options become available:`;
rulesText.append(turnOptionsAdditional);

let turnOptions2 = document.createElement("p");
turnOptions2.innerHTML = `2. Player can move their existing piece to another spot on the board (click on the piece you want to move + click on the new spot).`;
rulesText.append(turnOptions2);

let turnOptions3 = document.createElement("p");
turnOptions3.innerHTML = `3. Player can move the grid one spot in any direction on the game board (use arrow keys + press enter to lock new position).`;
rulesText.append(turnOptions3);

let winningHeading = document.createElement("h3");
winningHeading.innerHTML = `WINNING`;
rulesText.append(winningHeading);

let winningText = document.createElement("p");
winningText.innerHTML = `The goal is to get 3 pieces in a row inside the grid! The player who achieves this first, wins.`;
rulesText.append(winningText);

rules.appendChild(rulesHeading);
rules.appendChild(rulesText);

content.appendChild(rules);

let footerText = document.createElement("p");
footerText.classList.add("footer-text");
footerText.innerHTML = `
  &copy; 2025 @annilember. All rights reserved.
`;
content.appendChild(footerText);

document.body.appendChild(content);

console.log("App: Board loaded to DOM!");
