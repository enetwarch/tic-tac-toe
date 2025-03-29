window.addEventListener("load", () => {
    const main = new Main();
});

function Main() {
    if (!new.target) {
        throw Error(`Use the "new" keyword on the Main constructor.`);
    }

    [this.player, this.computer] = this.initializePlayers();
    this.board = this.initializeBoard();
    this.playerMove = true;

    this.board.updateClickListener((cell) => {
        const mark = this.playerMove ? this.player.mark : this.computer.mark;
        cell.updateState(mark);
        this.playerMove = !this.playerMove;
    });
}

Main.prototype.querySelector = function(query) {
    if (typeof query !== "string") {
        throw TypeError("id argument must be a string.");
    }

    const element = document.querySelector(query);
    if (!element) {
        throw Error(`"${query}" element does not exist.`);
    } else if (!(element instanceof HTMLElement)) {
        throw TypeError("element variable must be returned as an HTML element.");
    }

    return element;
}

Main.prototype.initializePlayers = function() {
    const player = new Player("Player", "x");
    const computer = new Player("Computer", "o");

    const players = [ player, computer ];
    if (!Array.isArray(players)) {
        throw TypeError("players variable must be returned as an array.");
    }

    return players;
}

Main.prototype.initializeBoard = function() {
    const container = this.querySelector(".board-container");
    const size = 3;

    const board = new Board(container, size);
    if (!(board instanceof Board)) {
        throw TypeError("board variable must be returned as a Board object.");
    }

    return board;
}

function Player(name, mark) {
    if (!new.target) {
        throw Error(`Use the "new" keyword on the Player constructor.`);
    }

    if (typeof name !== "string") {
        throw TypeError("name argument must be a string.");
    } else if (typeof mark !== "string") {
        throw TypeError("mark argument must be a string.");
    } else if (!(mark === "x" || mark === "o")) {
        throw TypeError(`mark argument must only be "x" or "o".`);
    }

    this.name = name;
    this.mark = mark;
}

function Board(container, size) {
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
        callback(cell);
    }

    this.element.addEventListener("click", this.listener);
}

Board.prototype.deleteClickListener = function() {
    if (this.listener) {
        return;
    }

    this.element.removeEventListener("click", this.listener);
    this.listener = null;
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
    if (x < 0 || x > this.size || y < 0 || y > this.size) {
        throw RangeError("coordinates argument is out of bounds.");
    }

    const cell = this.grid[x][y];
    if (!(cell instanceof Cell)) {
        throw TypeError("cell variable must be returned as a Cell object.");
    }

    return cell;
}

function Cell(coordinates) {
    if (!new.target) {
        throw Error(`Use the "new" keyword on the Cell constructor.`);
    }

    if (!Array.isArray(coordinates)) {
        throw TypeError("coordinates argument needs to be an array.");
    } else if (coordinates.length !== 2) {
        throw TypeError("coordinates argument must only contain 2 values");
    } else if (!coordinates.every(coordinate => typeof coordinate === "number")) {
        throw TypeError("coordinates argument needs to have number values");
    }

    this.element = document.createElement("button");
    this.element.classList.add("board-cell");
    this.element.type = "button";
    this.element.dataset.coordinates = JSON.stringify(coordinates);

    this.icon = document.createElement("i");
    this.element.appendChild(this.icon);

    this.state = "";
}

Cell.prototype.updateState = function(state) {
    if (this.state !== "") {
        return;
    }

    if (typeof state !== "string") {
        throw TypeError("state argument needs to be a string");
    }

    switch (state) {
        case "x": {
            this.icon.classList.add("x-icon", "fa-solid", "fa-x");
            this.state = "x";
            break;
        }

        case "o": {
            this.icon.classList.add("o-icon", "fa-solid", "fa-o");
            this.state = "o";
            break;
        }

        default: {
            throw TypeError(`state argument only accepts "x" and "o" values.`);
        }
    }
}