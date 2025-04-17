export class WinnerChecker {
    #board;
    #grid;

    constructor(board, grid) {
        this.#board = board;
        this.#grid = grid;
    }

    #setStrikeMiddleCoordinate(strike) {
        strike.coordinates[1].x = (strike.coordinates[0].x + strike.coordinates[2].x) / 2;
        strike.coordinates[1].y = (strike.coordinates[0].y + strike.coordinates[2].y) / 2;
        return strike;
    }

    #countRowOrColumnStrike(strike, x, y) {
        if (this.#grid[x][y]) {
            if (this.#board[x][y] === strike.player) strike.count++;
            else strike.count = 0;
        }
        else strike.count = 0;

        if (strike.count === 3) {
            strike.won = true;
            strike.coordinates[2].x = x;
            strike.coordinates[2].y = y;
        }
        
        return this.#setStrikeMiddleCoordinate(strike);
    }

    #checkDiagonalStreaks(player, x, y, action) {
        let strike = { player: player, count: 0, won: false, tie: false, coordinates: [{x: null, y: null}, {x: null, y: null}, {x: null, y: null}] };
        while (true) {
            try {
                if (strike.count === 0) {
                    strike.coordinates[0].x = x;
                    strike.coordinates[0].y = y;
                }
                if (this.#grid[x][y] && this.#board[x][y] === strike.player) strike.count++;
                if (strike.count === 3) {
                    strike.won = true;
                    strike.coordinates[2].x = x;
                    strike.coordinates[2].y = y;
                    return this.#setStrikeMiddleCoordinate(strike);
                };
                x++;
                y = action(y);
            }
            catch (e) {
                return this.#setStrikeMiddleCoordinate(strike);
            }
        }
    }

    checkIfWon(player) {
        for (let x = 0; x < 5; x++) {
            let rowStrike = { player: player, count: 0, won: false, tie: false, coordinates: [{x: x, y: null}, {x: null, y: null}, {x: null, y: null}] };
            let colStrike = { player: player, count: 0, won: false, tie: false, coordinates: [{x: null, y: x}, {x: null, y: null}, {x: null, y: null}] };

            for (let y = 0; y < 5; y++) {
                if (rowStrike.count === 0) rowStrike.coordinates[0].y = y;
                if (colStrike.count === 0) colStrike.coordinates[0].x = y;
                rowStrike = this.#countRowOrColumnStrike(rowStrike, x, y);
                colStrike = this.#countRowOrColumnStrike(colStrike, y, x);
                let diagonalStrike1 = this.#checkDiagonalStreaks(player, x, y, (i) => i + 1);
                let diagonalStrike2 = this.#checkDiagonalStreaks(player, x, y, (i) => i - 1);
                if (rowStrike.won) return rowStrike;
                if (colStrike.won) return colStrike;
                if (diagonalStrike1.won) return diagonalStrike1;
                if (diagonalStrike2.won) return diagonalStrike2;
            }
        }
        return { player: player, count: 0, won: false, tie: false, coordinates: [{x: null, y: null}, {x: null, y: null}, {x: null, y: null}] };
    }
}