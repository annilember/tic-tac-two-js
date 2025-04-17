export class GridMover {
    #grid = [[], [], [], [], []];
    #originalX;
    #originalY;
    #gridX;
    #gridY;
    #moveWasMade = false;

    constructor(grid) {
        this.#grid = grid;

        for (let x = 0; x < 5; x++) {
            for (let y = 0; y < 5; y++) {
                if (grid[x][y]) {
                    this.#originalX = x;
                    this.#originalY = y;
                    this.#gridX = x;
                    this.#gridY = y;
                    return;
                }
            };
        };
    };

    #updateGrid() {
        const startPostX = this.#gridX;
        const startPostY = this.#gridY;
        const endPosX = this.#gridX + 2;
        const endPosY = this.#gridY + 2;

        for (let x = 0; x < 5; x++) {
            for (let y = 0; y < 5; y++) {

                if (x >= startPostX &&
                    x <= endPosX &&
                    y >= startPostY &&
                    y <= endPosY
                ) {
                    this.#grid[x][y] = true;
                }
                else {
                    this.#grid[x][y] = false;
                }
            };
        };
    };

    #gridWasMoved() {
        return this.#originalX !== this.#gridX ||
            this.#originalY !== this.#gridY;
    };

    moveGrid(event) {
        switch (event.key) {
            case "ArrowUp":
                this.#gridX = Math.max(Math.max(this.#gridX - 1, this.#originalX - 1), 0);
                break;
            case "ArrowDown":
                this.#gridX = Math.min(Math.min(this.#gridX + 1, this.#originalX + 1), 2);
                break;
            case "ArrowLeft":
                this.#gridY = Math.max(Math.max(this.#gridY - 1, this.#originalY - 1), 0);
                break;
            case "ArrowRight":
                this.#gridY = Math.min(Math.min(this.#gridY + 1, this.#originalY + 1), 2);
                break;
            case "Enter":
                if (this.#gridWasMoved()) {
                    this.#moveWasMade = true;
                }
                break;
            default: // not working hmm...
                break;
        };
        this.#updateGrid();
    };

    moveGridByPosition(matrixPosition) {
        if (matrixPosition === 4) return false;
        this.#gridX = this.#originalX;
        this.#gridY = this.#originalY;

        if (matrixPosition < 3) this.#gridX = this.#originalX - 1;
        if (matrixPosition > 5) this.#gridX = this.#originalX + 1;
        if (matrixPosition % 3 === 0) this.#gridY = this.#originalY - 1;
        if ((matrixPosition - 2) % 3 === 0) this.#gridY = this.#originalY + 1;

        if (this.#gridX < 0 || this.#gridY < 0 || (this.#gridX + 2) > 4 || (this.#gridY + 2) > 4) return false;

        this.#updateGrid();
        return true;
    }

    get grid() {
        return JSON.parse(JSON.stringify(this.#grid));
    };

    get gridWasMoved() {
        return this.#gridWasMoved();
    };

    get moveWasMade() {
        return this.#moveWasMade;
    };
};
