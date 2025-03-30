import { Board, Cell } from "./modules/board.js";
import { Player, Button } from "./modules/controls.js";

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

    const winner = this.board.evaluateWinner(player.mark);
    if (winner) {
        console.log(`${player.name} wins!`);
    }
}