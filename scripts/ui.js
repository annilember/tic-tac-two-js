export function createGameModeContainer(startGame) {
    let gameModeContainer = document.createElement("div");
    gameModeContainer.classList.add("choose-game-mode");
    
    let text = document.createElement("h3");
    text.innerHTML = "Choose game mode to start playing";
    gameModeContainer.appendChild(text);
    
    let buttons = document.createElement("div");

    let hVsHButton = document.createElement("button");
    hVsHButton.classList.add("game-mode-button");
    let hVsHName = "Human vs Human"
    hVsHButton.innerHTML = hVsHName;
    hVsHButton.addEventListener("click", () => { startGame(hVsHName) });
    buttons.appendChild(hVsHButton);
    
    let hVsAiButton = document.createElement("button");
    hVsAiButton.classList.add("game-mode-button");
    let hVsAiName = "Human vs AI";
    hVsAiButton.innerHTML = hVsAiName;
    hVsAiButton.addEventListener("click", () => { startGame(hVsAiName) });
    buttons.appendChild(hVsAiButton);

    gameModeContainer.appendChild(buttons);
    
    return gameModeContainer;
}

export function createBoard(boardState, gridState, cellUpdate) {
    console.log("UI: getBoard is running!");

    let board = document.createElement("div");
    board.classList.add("board");

    for (let y = 0; y < 5; y++) {
        let row = document.createElement("div");
        row.classList.add("row");

        for (let x = 0; x < 5; x++) {
            let cell = document.createElement("div");
            cell.classList.add("cell");
            cell.id = `cell-${x}-${y}`;
            if (gridState[x][y] === true) {
                cell.classList.add("grid");
            }
            cell.addEventListener("click", () => { cellUpdate(x, y) }); // This is a closure.
            cell.innerHTML = boardState[x][y] || "";
            row.appendChild(cell);
        }
        board.appendChild(row);
    }

    console.log("UI: Board elements loaded to DOM!");

    return board;
}

export function updateCell(boardState, x, y) {
    console.log("updating cell")
    const cell = document.querySelector(`#cell-${x}-${y}`);
    cell.innerHTML = boardState[x][y] || "";
}

export function updateGridState(gridState, movableGridState) {

    for (let y = 0; y < 5; y++) {
        for (let x = 0; x < 5; x++) {

            const cell = document.querySelector(`#cell-${x}-${y}`);

            if (gridState[x][y] === true) {
                cell.classList.add("grid");
            }
            else {
                cell.classList.remove("grid");
            }

            if (movableGridState && movableGridState[x][y] === true) {
                cell.classList.add("movable-grid");
            }
            else {
                cell.classList.remove("movable-grid");
            }
        }
    }
}

export function drawWinningCells(winnerInfo) {
    console.log("GOT HERE 1")
    console.log(winnerInfo)
    winnerInfo.coordinates.forEach(cell => {
        console.log("GOT HERE 2")
        document.querySelector(`#cell-${cell.x}-${cell.y}`).classList.add("winning-cell");
    });
}