import Cell from "./cell.js";

export default function Board(element, grid, size = 3) {
    if (!new.target) {
        throw Error(`Use the "new" keyword on the Board constructor.`);
    }

    if (!(element instanceof HTMLElement)) {
        throw TypeError("container argument needs to be an HTML element.");
    } else if (!Array.isArray(grid)) {
        throw TypeError("grid argument needs to be an array.");
    } else if (typeof size !== "number") {
        throw TypeError("size argument needs to be a number.");
    } else if (grid.flat(1).length !== size * size) {
        throw TypeError("grid argument does not match the size argument.");
    } else if (!grid.flat(1).every(cell => cell instanceof Cell)) {
        throw TypeError("grid argument must contain Cell objects.");
    }

    this.element = element;
    this.grid = grid;
    this.size = size;

    this.clickCallback = null;

    this.grid.flat(1).forEach(cell => {
        this.element.appendChild(cell.getElement());
    });
}

Board.prototype.reset = function() {
    const cells = this.grid.flat(1);
    cells.forEach(cell => cell.reset());
}

Board.prototype.onCellClick = function(callback, cellQueryClass = ".board-cell") {
    if (typeof callback !== "function") {
        throw TypeError("callback argument needs to be a function.");
    } else if (typeof cellQueryClass !== "string") {
        throw TypeError("cellQueryClass argument needs to be a string.");
    }

    if (this.clickCallback) {
        this.element.removeEventListener("click", this.clickCallback);
    }

    this.clickCallback = (event) => {
        const cellElement = event.target.closest(cellQueryClass);
        if (!cellElement) return;

        const coordinates = JSON.parse(cellElement.dataset.coordinates);
        const cell = this.findCell(coordinates);
        if (cell.getMark() !== "") return;

        callback(cell);
    };

    this.element.addEventListener("click", this.clickCallback);
}

Board.prototype.isValidCoordinates = function(coordinates) {
    if (!Array.isArray(coordinates)) return false;
    if (coordinates.length !== 2) return false;
    if (!coordinates.every(coord => typeof coord === "number")) return false;

    const [x, y] = coordinates;
    if (x < 0 || x >= this.size || y < 0 || y >= this.size) return false;

    return true;
}

Board.prototype.validateCoordinates = function(coordinates) {
    if (!this.isValidCoordinates(coordinates)) {
        throw TypeError(`Invalid coordinates: ${JSON.stringify(coordinates)}.`);
    }
}

Board.prototype.findCell = function(coordinates) {
    this.validateCoordinates(coordinates);

    const [x, y] = coordinates;
    const cell = this.grid[x][y];
    if (!(cell instanceof Cell)) {
        throw TypeError("cell variable must be returned as a Cell object.");
    }

    return cell;
}

Board.prototype.isWinner = function(mark) {
    if (typeof mark !== "string") {
        throw TypeError("mark argument must be a string.");
    } else if (!(mark === "x" || mark === "o")) {
        throw TypeError(`mark argument must only be "x" or "o".`);
    }

    for (const cell of this.grid.flat(1)) {
        if (cell.getMark() !== mark) continue;

        for (const direction of Board.DIRECTIONS) {
            const consecutiveMarks = this.getConsecutiveMarks(direction, cell);
            if (consecutiveMarks.length === this.size) return consecutiveMarks;
        }
    }

    return null;
}

Board.prototype.getConsecutiveMarks = function(direction, cell) {
    if (typeof direction !== "function") {
        throw TypeError("direction argument needs to be a function.");
    } else if (!(cell instanceof Cell)) {
        throw TypeError("cell argument must be a Cell object.");
    }

    const [x, y] = cell.getCoordinates();
    const consecutiveMarks = [];

    for (let i = 0; i < this.size; i++) {
        const [dx, dy] = direction(x, y, i);
        if (!this.isValidCoordinates([dx, dy])) return consecutiveMarks;
        
        const dcell = this.grid[dx][dy];
        if (dcell.getMark() !== cell.getMark()) return consecutiveMarks;

        consecutiveMarks.push([dx, dy]);
    }

    return consecutiveMarks;
}

Board.DIRECTIONS = [
    (x, y, i) => [x - i, y],     // North
    (x, y, i) => [x - i, y + i], // Northeast
    (x, y, i) => [x, y + i],     // East
    (x, y, i) => [x + i, y + i], // Southeast
    (x, y, i) => [x + i, y],     // South
    (x, y, i) => [x + i, y - i], // Southwest
    (x, y, i) => [x, y - i],     // West
    (x, y, i) => [x - i, y - i], // Northwest
];