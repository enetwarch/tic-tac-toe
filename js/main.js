import Button from "./modules/button.js";
import Modal from "./modules/modal.js";
import Form from "./modules/form.js";
import Board from "./modules/board.js";
import Cell from "./modules/cell.js";
import Player from "./modules/player.js";

window.addEventListener("load", () => {
    const main = new Main();
});

function Main() {
    if (!new.target) {
        throw Error(`Use the "new" keyword on the Main constructor.`);
    }

    this.initializeButtons();
    this.initializeModals();
    this.initializeForm();
    this.initializeBoard();
    
    this.resetButton.addListener("click", () => {
        this.resetButton.invertButton();
        this.resetModal.showModal();
    });

    this.resetModal.addCallback("close", () => {
        this.resetButton.invertButton();
    });

    this.noResetButton.addListener("click", () => {
        this.resetModal.closeModal();
    });

    this.yesResetButton.addListener("click", () => {
        this.board.resetBoard();
        this.resetModal.closeModal();
    });

    this.userButton.addListener("click", () => {
        this.userButton.invertButton();
        this.playerModal.showModal();
    });

    this.playerModal.addCallback("open", () => {
        if (!(this.playerOne && this.playerTwo)) {
            return;
        }

        const nameOne = this.playerOne.name;
        const nameTwo = this.playerTwo.name;

        const players = {
            "player-one": nameOne === "Player One" ? "" : nameOne,
            "player-two": nameTwo === "Player Two" ? "" : nameTwo
        };

        this.playerForm.insertValues(players);
    });

    this.playerModal.addCallback("close", () => {
        this.userButton.invertButton();

        if (!this.playerOne) {
            this.playerOne = new Player("Player One", "x");
        }

        if (!this.playerTwo) {
            this.playerTwo = new Player("Player Two", "o");
        }

        const players = [this.playerOne, this.playerTwo];
        localStorage.setItem("players", JSON.stringify(players));

        this.playerForm.resetForm();
    });

    this.playerForm.changeSubmitListener(formData => {
        this.updatePlayers(formData);
    });

    this.playerOneTurn = true;
    this.board.updateClickListener(cell => {
        this.playTurn(cell);
    });

    const players = JSON.parse(localStorage.getItem("players"));
    if (!players) {
        this.userButton.invertButton();
        this.playerModal.showModal();    
    } else {
        [this.playerOne, this.playerTwo] = players;
    }
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

Main.prototype.updatePlayers = function(formData) {
    if (!(formData instanceof FormData) && !formData) {
        throw TypeError("formData argument must be a FormData object.");
    }

    let nameOne = formData.get("player-one").trim();
    let nameTwo = formData.get("player-two").trim();

    if (nameOne.length < 1) {
        nameOne = "Player One";
    }

    if (nameTwo.length < 1) {
        nameTwo = "Player Two";
    }

    this.playerOne = new Player(nameOne, "x");
    this.playerTwo = new Player(nameTwo, "o");

    const players = [this.playerOne, this.playerTwo];
    localStorage.setItem("players", JSON.stringify(players));

    this.playerModal.closeModal();
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

Main.prototype.initializeButtons = function() {
    const resetButtonElement = this.getElementById("reset-button");
    this.resetButton = new Button(resetButtonElement);

    const playButtonElement = this.getElementById("play-button");
    this.playButton = new Button(playButtonElement);

    const userButtonElement = this.getElementById("user-button");
    this.userButton = new Button(userButtonElement);

    const noResetButtonElement = this.getElementById("no-reset-button");
    this.noResetButton = new Button(noResetButtonElement);

    const yesResetButtonElement = this.getElementById("yes-reset-button");
    this.yesResetButton = new Button(yesResetButtonElement);

    const confirmPlayerButtonElement = this.getElementById("confirm-player-button");
    this.confirmPlayerButton = new Button(confirmPlayerButtonElement);
}

Main.prototype.initializeModals = function() {
    const resetModalElement = this.getElementById("reset-modal");
    this.resetModal = new Modal(resetModalElement);

    const playerModalElement = this.getElementById("player-modal");
    this.playerModal = new Modal(playerModalElement);
}

Main.prototype.initializeForm = function() {
    const playerFormElement = this.getElementById("player-form");
    this.playerForm = new Form(playerFormElement);
}

Main.prototype.initializeBoard = function() {
    const container = this.getElementById("board-container");
    this.board = new Board(container);
}