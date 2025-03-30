import Cell from "./cell.js";

export default function Board(container, size = 3) {
    if (!new.target) {
        throw Error(`Use the "new" keyword on the Board constructor.`);
    }

    if (!(container instanceof HTMLElement)) {
        throw TypeError("container argument needs to be an HTML element.");
    } else if (typeof size !== "number") {
        throw TypeError("size argument needs to be a number.");
    }

    this.container = container;
    this.size = size;

    this.element = document.createElement("div");
    this.element.classList.add("board-grid");

    this.finished = false;
    this.grid = [];

    for (let x = 0; x < this.size; x++) {
        this.grid[x] = [];

        for (let y = 0; y < this.size; y++) {
            const coordinates = [x, y];
            const cell = new Cell(coordinates);

            this.grid[x][y] = cell;
            this.element.appendChild(cell.element);
        }
    }

    this.container.appendChild(this.element);
}

Board.prototype.updateClickListener = function(callback) {
    if (typeof callback !== "function") {
        throw TypeError("callback argument needs to be a function.");
    }

    if (this.listener) {
        this.deleteClickListener();
    }

    this.listener = event => {
        const cellElement = event.target.closest(".board-cell");
        if (!cellElement) {
            return;
        }

        const coordinates = JSON.parse(cellElement.dataset.coordinates);
        const cell = this.findCell(coordinates);

        if (cell.mark !== "") {
            return;
        }

        if (this.finished) {
            return;
        }

        callback(cell);
    }

    this.element.addEventListener("click", this.listener);
}

Board.prototype.deleteClickListener = function() {
    if (!this.listener) {
        return;
    }

    this.element.removeEventListener("click", this.listener);
    this.listener = null;
}

Board.prototype.resetBoard = function() {
    if (this.finished) {
        this.finished = false;
    }

    const cells = this.grid.flat(1);
    cells.forEach(cell => {
        cell.resetMark();
    });
}

Board.prototype.findCell = function(coordinates) {
    if (!Array.isArray(coordinates)) {
        throw TypeError("coordinates argument needs to be an array.");
    } else if (coordinates.length !== 2) {
        throw TypeError("coordinates argument must only contain 2 values");
    } else if (!coordinates.every(coordinate => typeof coordinate === "number")) {
        throw TypeError("coordinates argument needs to have number values");
    }

    const [x, y] = coordinates;
    if (x < 0 || x >= this.size || y < 0 || y >= this.size) {
        throw RangeError("coordinates argument is out of bounds.");
    }

    const cell = this.grid[x][y];
    if (!(cell instanceof Cell)) {
        throw TypeError("cell variable must be returned as a Cell object.");
    }

    return cell;
}

Board.prototype.evaluateWinner = function(mark) {
    if (typeof mark !== "string") {
        throw TypeError("mark argument must be a string.");
    } else if (!(mark === "x" || mark === "o")) {
        throw TypeError(`mark argument must only be "x" or "o".`);
    }

    const rows = this.grid.length;
    const columns = this.grid[0].length;
    const directions = this.directionalFunctions();

    let consecutiveMarks = 0;

    for (let i = 0; i < rows * columns; i++) {
        const x = Math.floor(i / columns);
        const y = i % columns;

        const cell = this.grid[x][y];
        if (cell.mark !== mark) {
            continue;
        }

        consecutiveMarks++;
        let directionIndex = 0;

        while (directionIndex < directions.length) {
            const direction = directions[directionIndex];
            const [dx, dy] = direction(x, y, consecutiveMarks);

            const outOfBounds = dx < 0 || dx >= rows || dy < 0 || dy >= columns;
            const incorrectMark = !outOfBounds && this.grid[dx][dy].mark !== mark;

            if (outOfBounds || incorrectMark) {
                consecutiveMarks = 1;
                directionIndex++;
                continue;
            }

            consecutiveMarks++;
            if (consecutiveMarks === this.size) {
                this.finished = true;
                return true;
            }    
        }

        consecutiveMarks = 0;
    }

    return false;
}

Board.prototype.directionalFunctions = function() {
    const directions = [
        (x, y, i) => [x - i, y - i], // Northwest
        (x, y, i) => [x - i, y],     // North
        (x, y, i) => [x - i, y + i], // Northeast
        (x, y, i) => [x, y - i],     // West
        (x, y, i) => [x, y + i],     // East
        (x, y, i) => [x + i, y - i], // Southwest
        (x, y, i) => [x + i, y],     // South
        (x, y, i) => [x + i, y + i]  // Southeast
    ];

    return directions;
}