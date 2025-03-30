window.addEventListener("load", () => {
    const main = new Main();
});

function Main() {
    if (!new.target) {
        throw Error(`Use the "new" keyword on the Main constructor.`);
    }

    [this.resetButton, this.playButton, this.userButton] = this.initializeButtons();
    [this.playerOne, this.playerTwo] = this.initializePlayers();
    this.board = this.initializeBoard();
    
    this.playerOneTurn = true;

    this.resetButton.triggerButtonListener(() => this.board.resetBoard());
    this.board.updateClickListener(cell => this.playTurn(cell));
}

Main.prototype.getElementById = function(id) {
    if (typeof id !== "string") {
        throw TypeError("id argument must be a string.");
    }

    const element = document.getElementById(id);
    if (!element) {
        throw Error(`"${id}" element id does not exist.`);
    } else if (!(element instanceof HTMLElement)) {
        throw TypeError("element variable must be returned as an HTML element.");
    }

    return element;
}

Main.prototype.initializePlayers = function() {
    const playerOne = new Player("Player One", "x");
    const playerTwo = new Player("Player Two", "o");

    const players = [playerOne, playerTwo];
    if (!Array.isArray(players)) {
        throw TypeError("players variable must be returned as an array.");
    }

    return players;
}

Main.prototype.initializeBoard = function() {
    const container = this.getElementById("board-container");

    const board = new Board(container);
    if (!(board instanceof Board)) {
        throw TypeError("board variable must be returned as a Board object.");
    }

    return board;
}

Main.prototype.initializeButtons = function() {
    const resetButtonElement = this.getElementById("reset-button");
    const resetButton = new Button(resetButtonElement);

    const playButtonElement = this.getElementById("play-button");
    const playButton = new Button(playButtonElement);

    const userButtonElement = this.getElementById("user-button");
    const userButton = new Button(userButtonElement);

    return [resetButton, playButton, userButton];
}

Main.prototype.playTurn = function(cell) {
    if (!(cell instanceof Cell)) {
        throw TypeError("cell argument must be a Cell object.");
    }

    const player = this.playerOneTurn ? this.playerOne : this.playerTwo;
    this.playerOneTurn = !this.playerOneTurn;

    cell.updateMark(player.mark);

    const winner = this.board.evaluateWinner(player.name, player.mark);
    if (winner) {
        console.log(`${player.name} wins!`);
    }
}

function Button(element) {
    if (!new.target) {
        throw Error(`Use the "new" keyword on the Button constructor.`);
    }

    if (!(element instanceof HTMLElement)) {
        throw TypeError("element argument must be an HTMLElement");
    }

    this.element = element;
    this.isToggled = false;
}

Button.prototype.triggerButtonListener = function(callback) {
    if (typeof callback !== "function") {
        throw TypeError("callback argument must be a function.");
    }

    this.element.addEventListener("click", () => callback());
}

Button.prototype.toggleButtonListener = function(callback, className = "inverted") {
    if (typeof callback !== "function") {
        throw TypeError("callback argument must be a function.");
    }

    this.element.classList.toggle(className);
    this.isToggled = !this.isToggled;

    callback(this.isToggled);
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

function Board(container, size = 3) {
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

Board.prototype.evaluateWinner = function(name, mark) {
    if (typeof name !== "string") {
        throw TypeError("name argument must be a string.");
    } else if (typeof mark !== "string") {
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

    this.mark = "";
}

Cell.prototype.updateMark = function(mark) {
    if (this.mark !== "") {
        return;
    }

    if (typeof mark !== "string") {
        throw TypeError("mark argument needs to be a string");
    }

    switch (mark) {
        case "x": {
            this.icon.classList.add("x-icon", "fa-solid", "fa-x");
            break;
        }

        case "o": {
            this.icon.classList.add("o-icon", "fa-solid", "fa-o");
            break;
        }

        default: {
            throw TypeError(`mark argument only accepts "x" and "o" values.`);
        }
    }

    this.mark = mark;
}

Cell.prototype.resetMark = function() {
    if (this.mark === "") {
        return;
    }

    this.mark = "";
    this.icon.classList.remove(...this.icon.classList);
}