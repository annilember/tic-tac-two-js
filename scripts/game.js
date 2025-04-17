import { WinnerChecker } from "./checkForWin.js";
import { GridMover } from "./moveGrid.js";
import { Ai } from "./ai.js";

export class GameBrain {
    #gameModes = ["Human vs Human", "Human vs AI"];
    #gameMode;
    #ai;
    #aiMadeAMove = false;
    #board = [[], [], [], [], []];
    #grid = [[], [], [], [], []];
    #movableGrid = [[], [], [], [], []];
    #isMovingGrid = false;
    #isMovingPiece = false;
    #gridMover;
    #xPieces = 4;
    #oPieces = 4;
    #gameOver = false;

    currentPlayer = "X";

    constructor() {
        this.#initializeGrid();
    }

    #initializeGrid() {
        for (let x = 0; x < 5; x++) {
            for (let y = 0; y < 5; y++) {
                if (x > 0 && y > 0 && x < 4 && y < 4) {
                    this.#grid[x][y] = true;
                }
                else {
                    this.#grid[x][y] = false;
                }
            }
        }
    }

    #canMovePiece() {
        return (this.#xPieces < 3) && (this.#oPieces < 3) && !this.#currentPlayerIsAi();
    }

    #canMoveGrid() {
        return this.#canMovePiece() && !this.#isMovingPiece;
    }

    #currentPlayerIsAi() {
        return this.#gameMode === this.#gameModes[1] &&
            this.currentPlayer === "O";
    }

    #switchTurn() {
        this.currentPlayer = this.currentPlayer === "X" ? "O" : "X";
    }

    #aiTurn() {
        let aiMadeAMove = this.#ai.makeAMove(this.board, this.grid, this.#oPieces);
        this.#switchTurn();
        if (!aiMadeAMove) {
            console.log("AI did not move");
            return;
        }
        else if (this.#canMoveGrid() && this.#ai.movedGrid) {
            console.log("AI moved grid");
            this.#grid = this.#ai.grid;
        }
        else if (this.#canMovePiece() && !this.#ai.placedPiece) {
            console.log("AI moved piece");
            this.#board = this.#ai.board;
        }
        else if (this.#oPieces > 0 && this.#ai.placedPiece) {
            console.log("AI placed piece");
            this.#board = this.#ai.board;
            this.#oPieces--;
        }
        this.#aiMadeAMove = true;
        console.log("AI completed a move, result: ", this.#board, this.#grid)
        this.#checkIfGameOverAndGetWinner();
    }

    #checkIfGameOverAndGetWinner() {
        console.log("Game: checking for winner!")
        let winnerChecker = new WinnerChecker(this.#board, this.#grid);
        let x = winnerChecker.checkIfWon("X");
        let o = winnerChecker.checkIfWon("O");
        if (x.won && o.won) {
            console.log("Game: It's a tie!"); // how are lines drawn if tie ???
            x.tie = true;
            this.#gameOver = true;
            return x;
        };
        if (x.won) {
            console.log("Game: X won!");
            this.#gameOver = true;
        }
        else if (o.won) {
            console.log("Game: O won!");
            this.#gameOver = true;
        }
        return x.won ? x : o;
    }

    setGameMode(modeName) {
        this.#gameMode = this.#gameModes.find(x => x === modeName);
        if (!this.#gameMode) {
            throw new RangeError(`Invalid game mode: ${modeName}`);
        }

        if (this.#gameMode === this.#gameModes[1]) {
            this.#ai = new Ai("O");
        }
    }

    makeAMove(x, y) {
        this.#isMovingGrid = false;
        if (this.#currentPlayerIsAi()) return;

        if (this.#board[x][y] === undefined || this.#board[x][y] === null) {

            if (this.currentPlayer === "X" && this.#xPieces > 0) {
                this.#board[x][y] = this.currentPlayer;
                this.#xPieces--;
                this.#switchTurn();
            }
            else if (this.currentPlayer === "O" && this.#oPieces > 0) {
                this.#board[x][y] = this.currentPlayer;
                this.#oPieces--;
                this.#switchTurn();
            }

            if (this.#isMovingPiece) {
                this.#isMovingPiece = false;
            }
        }
        else if (
            this.#canMovePiece() &&
            this.#board[x][y] === "X" &&
            this.currentPlayer === "X"
        ) {
            this.#board[x][y] = null;
            this.#xPieces++;
            this.#isMovingPiece = true;
        }
        else if (
            this.#canMovePiece() &&
            this.#board[x][y] === "O" &&
            this.currentPlayer === "O"
        ) {
            this.#board[x][y] = null;
            this.#oPieces++;
            this.#isMovingPiece = true;
        }

        this.#checkIfGameOverAndGetWinner();
        if (!this.gameOver && this.#currentPlayerIsAi()) this.#aiTurn();
    }

    moveGrid(event) {
        if (!this.#canMoveGrid()) return;

        if (!this.#isMovingGrid) {
            this.#gridMover = new GridMover(this.grid);
            this.#isMovingGrid = true;
        }

        this.#gridMover.moveGrid(event);

        if (this.#gridMover.moveWasMade) {
            console.log("Game: fixing new grid position.");
            this.#grid = this.#gridMover.grid;
            this.#switchTurn();
            this.#isMovingGrid = false;
        }
        else if (this.#gridMover.gridWasMoved) {
            console.log("Game: fixing new movable grid position.");
            this.#movableGrid = this.#gridMover.grid;
        }
        else {
            console.log("Game: cancelled grid move.");
            this.#isMovingGrid = false;
        }

        this.#checkIfGameOverAndGetWinner();
        if (!this.gameOver && this.#currentPlayerIsAi()) this.#aiTurn();
    }

    get board() {
        return JSON.parse(JSON.stringify(this.#board)); // Returns a deep copy.
    }

    get grid() {
        return JSON.parse(JSON.stringify(this.#grid));
    }

    get movableGrid() {
        if (this.#isMovingGrid) {
            return JSON.parse(JSON.stringify(this.#movableGrid));
        }
        return false;
    }

    get gameOver() {
        return this.#gameOver;
    }

    get winner() {
        return this.#checkIfGameOverAndGetWinner();
    }

    get aiMadeAMove() {
        let result = this.#aiMadeAMove;
        this.#aiMadeAMove = false;
        return result;
    }

    get aiMoveInfo() {
        return {
            x: this.#ai.x,
            y: this.#ai.y,
            removedX: this.#ai.removedX,
            removedY: this.#ai.removedY,
            movedGrid: this.#ai.movedGrid
        }
    }
};
