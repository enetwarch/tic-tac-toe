import Player from "../modules/player.js";
import Board from "../modules/board.js";
import Cell from "../modules/cell.js";

export default function Game(players, playerCount = 2, boardSize = 3) {
    if (!new.target) {
        throw Error(`Use the "new" keyword on the Game constructor.`);
    }

    if (!Array.isArray(players)) {
        throw TypeError("players argument must be an array.");
    } else if (!players.every(player => player instanceof Player)) {
        throw TypeError("players argument must only have Player objects as elements.");
    } else if (typeof boardSize !== "number") {
        throw TypeError("boardSize argument must be a number.");
    } else if (typeof playerCount !== "number") {
        throw TypeError("playerCount argument must be a number.");
    } else if (players.length !== playerCount) {
        throw TypeError(`players argument must only have ${playerCount} players.`);
    }

    this.players = players;

    const boardElement = document.getElementById("board");
    const grid = Game.createCellGrid(boardSize);

    this.board = new Board(boardElement, grid);
    this.board.onCellClick(this.playTurn.bind(this));

    this.paused = false;
    this.finished = false;

    document.addEventListener("gamepause", () => this.setPaused(true));
    document.addEventListener("gameresume", () => this.setPaused(false));    
    document.addEventListener("gamereset", this.reset.bind(this));

    this.reset();
}

Game.prototype.isPaused = function() {
    return this.paused;
}

Game.prototype.isFinished = function() {
    return this.finished;
}

Game.prototype.setPaused = function(value) {
    if (typeof value !== "boolean") {
        throw TypeError("value argument must be a boolean.");
    }

    this.paused = value;
}

Game.prototype.setFinished = function(value) {
    if (typeof value !== "boolean") {
        throw TypeError("value argument must be a boolean.");
    }

    this.finished = value;
}

Game.prototype.reset = function() {
    this.setPaused(true);
    this.setFinished(false);

    this.board.reset();

    this.players.forEach(player => {
        player.setTurn(false);
    });

    const playerOne = this.players[0];
    playerOne.setTurn(true);
}

Game.prototype.playTurn = function(cell) {
    if (this.paused || this.finished) return;

    if (!(cell instanceof Cell)) {
        throw TypeError("cell argument must be a Cell object.");
    }

    const currentPlayer = this.players.find(player => player.getTurn());
    cell.setMark(currentPlayer.getMark());
    
    const winner = this.board.isWinner(currentPlayer.getMark());
    if (winner) {
        this.setFinished(true);
        document.dispatchEvent(new CustomEvent("gameover", {
            "detail": {
                "winner": currentPlayer.getName(),
            }
        }));

        return;
    }

    const nextPlayer = this.getNextPlayer(currentPlayer);

    currentPlayer.setTurn(false);
    nextPlayer.setTurn(true);
}

Game.prototype.getNextPlayer = function(currentPlayer = undefined) {
    if (!(currentPlayer instanceof Player) && currentPlayer !== undefined) {
        throw TypeError("currentPlayer argument needs to be a Player object.");
    }

    if (currentPlayer === undefined) {
        currentPlayer = this.players.find(player => player.getTurn());
    }

    if (!currentPlayer) {
        const nextPlayer = this.players[0];
        return nextPlayer;
    }

    const nextPlayerIndex = this.players.indexOf(currentPlayer) + 1;
    const nextPlayer = this.players[nextPlayerIndex % this.players.length];
    return nextPlayer;
}

Game.createCellGrid = function(size = 3) {
    if (typeof size !== "number") {
        throw TypeError("size argument must be a number.");
    }
    
    const grid = Array.from({ length: size }, (_, x) => {
        return Array.from({ length: size }, (_, y) => new Cell([x, y]));
    });

    return grid;
}