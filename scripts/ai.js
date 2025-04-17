import { WinnerChecker } from "./checkForWin.js";
import { GridMover } from "./moveGrid.js";

export class Ai {
    #boardState = [[], [], [], [], []];
    #gridState = [[], [], [], [], []];
    #aiGamePiece;
    #x;
    #y;
    #movedPiece = false;
    #movedGrid = false;
    #removedX;
    #removedY;

    constructor(gamePiece) {
        this.#aiGamePiece = gamePiece;
    }

    #getRandomIndex(i = 5) {
        return Math.floor(Math.random() * i);
    }

    #getBoardCopy(board = this.#boardState) {
        return JSON.parse(JSON.stringify(board));
    }

    #checkIfWon(board, grid, gamePiece) {
        let winnerCheckerAi = new WinnerChecker(board, grid);
        const player = winnerCheckerAi.checkIfWon(gamePiece);
        return player.won;
    }

    #placePieceRandomly(board = this.#getBoardCopy()) {
        do {
            this.#x = this.#getRandomIndex();
            this.#y = this.#getRandomIndex();
            if (!board[this.#x][this.#y]) {
                this.#boardState[this.#x][this.#y] = this.#aiGamePiece;
                return true;
            }
        }
        while (true);
    }

    #moveRandomPiece() {
        let boardCopy = this.#getBoardCopy();
        const i = this.#getRandomIndex(4);
        let count = 0;

        for (let x = 0; x < 5; x++) {
            for (let y = 0; y < 5; y++) {

                if (
                    boardCopy[x][y] === this.#aiGamePiece &&
                    count === i
                ) {
                    boardCopy[x][y] = "R";
                    this.#placePieceRandomly(boardCopy);
                    this.#movedPiece = true;
                    this.#boardState[x][y] = null;
                    this.#removedX = x;
                    this.#removedY = y;
                    return true;
                }
                else if (boardCopy[x][y] === this.#aiGamePiece) count++;
            }
        }
        return false;
    }

    #moveGridRandomly() {
        do {
            let position = this.#getRandomIndex(9);
            let gridCopy = this.#getBoardCopy(this.#gridState);
            let gridMoverAi = new GridMover(gridCopy);

            const isValidPosition = gridMoverAi.moveGridByPosition(position);
            if (isValidPosition) {

                this.#movedGrid = true;
                this.#gridState = this.#getBoardCopy(gridMoverAi.grid);
                return true;
            }
        }
        while (true);
    }

    #placePieceCheckIfWon(gamePiece, board = this.#getBoardCopy()) {
        let boardCopy = this.#getBoardCopy(board);

        for (let x = 0; x < 5; x++) {
            for (let y = 0; y < 5; y++) {

                if (!boardCopy[x][y]) {
                    boardCopy[x][y] = gamePiece;
                    const won = this.#checkIfWon(boardCopy, this.#gridState, gamePiece);
                    if (won) {
                        this.#x = x;
                        this.#y = y;
                        this.#boardState[x][y] = this.#aiGamePiece;
                        return true;
                    }
                }
                boardCopy = this.#getBoardCopy(board);
            }
        }
        return false;
    }

    #movePieceCheckIfWon(gamePiece) {
        let boardCopy = this.#getBoardCopy();

        for (let x = 0; x < 5; x++) {
            for (let y = 0; y < 5; y++) {

                if (boardCopy[x][y] === this.#aiGamePiece) {
                    boardCopy[x][y] = "R";
                    const won = this.#placePieceCheckIfWon(gamePiece, boardCopy);

                    if (won) {
                        this.#movedPiece = true;
                        this.#boardState[x][y] = null;
                        this.#removedX = x;
                        this.#removedY = y;
                        return true;
                    };
                }
                boardCopy = this.#getBoardCopy();
            }
        }
        return false;
    }

    #moveGridCheckIfWon(gamePiece) {
        let boardCopy = this.#getBoardCopy();

        for (let position = 0; position < 9; position++) {
            let gridCopy = this.#getBoardCopy(this.#gridState);
            let gridMoverAi = new GridMover(gridCopy);

            const isValidPosition = gridMoverAi.moveGridByPosition(position);
            if (isValidPosition) {

                const won = this.#checkIfWon(boardCopy, gridMoverAi.grid, gamePiece);
                if (won) {
                    this.#movedGrid = true;
                    this.#gridState = this.#getBoardCopy(gridMoverAi.grid);
                    return true;
                }
            }
        }
        return false;
    }

    makeAMove(boardState, gridState, numberOfPiecesLeft) {
        this.#boardState = boardState;
        this.#gridState = gridState;
        this.#movedPiece = false;
        this.#movedGrid = false;

        if (numberOfPiecesLeft > 0) {
            if (!this.#placePieceCheckIfWon("O")) {
                if (!this.#placePieceCheckIfWon("X")) {
                    return this.#placePieceRandomly();
                }
            }
        }
        else if (numberOfPiecesLeft < 3) {
            if (!this.#movePieceCheckIfWon("O")) {
                if (!this.#moveGridCheckIfWon("O")) {
                    if (!this.#movePieceCheckIfWon("X")) {

                        let chooseMove = this.#getRandomIndex(2);
                        let move;
                        if (chooseMove) {
                            move = this.#moveRandomPiece();
                        }
                        else {
                            move = this.#moveGridRandomly();
                        }
                        return move;
                    }
                }
            }
        }

        return true;
    }

    get board() {
        return this.#getBoardCopy();
    }

    get grid() {
        return this.#getBoardCopy(this.#gridState);
    }

    get x() {
        return this.#x;
    }

    get y() {
        return this.#y;
    }

    get removedX() {
        return this.#removedX;
    }

    get removedY() {
        return this.#removedY;
    }

    get placedPiece() {
        return !this.#movedPiece;
    }

    get movedGrid() {
        return this.#movedGrid;
    }
}