import elements from "./data/elements.json" with { "type": "json" };
import Button from "./modules/button.js";
import Modal from "./modules/modal.js";
import Form from "./modules/form.js";
import Board from "./modules/board.js";
import Cell from "./modules/cell.js";
import Player from "./modules/player.js";

window.addEventListener("load", () => {
    const main = new Main();

    if (main.playerOne && main.playerTwo) {
        main.clickPlayButton();
    }
});

function Main() {
    if (!new.target) {
        throw Error(`Use the "new" keyword on the Main constructor.`);
    }

    this.initializeElements(elements);
    
    this.resetButton.addToggleState(this.toggleResetButton.bind(this));
    this.resetButton.addListener("click", this.clickResetButton.bind(this));
    this.resetModal.addCallback("close", this.closeResetModal.bind(this));
    this.noResetButton.addListener("click", this.clickNoResetButton.bind(this));
    this.yesResetButton.addListener("click", this.clickYesResetButton.bind(this));

    this.playButton.addToggleState(this.togglePlayButton.bind(this));
    this.playButton.addListener("click", this.clickPlayButton.bind(this));
    document.addEventListener("keydown", this.keydownPlayButton.bind(this));
    document.addEventListener("keyup", this.keyupPlayButton.bind(this));

    this.userButton.addToggleState(this.toggleUserButton.bind(this));
    this.userButton.addListener("click", this.clickUserButton.bind(this));
    this.playerModal.addCallback("open", this.openPlayerModal.bind(this));
    this.playerModal.addCallback("close", this.closePlayerModal.bind(this));
    this.playerForm.onSubmit(this.updatePlayers.bind(this));

    this.playerOneTurn = true;
    this.board.onCellClick(this.playTurn.bind(this));

    const players = JSON.parse(localStorage.getItem("players"));
    if (!players) {
        this.userButton.invertButton();
        this.playerModal.showModal();    
    } else {
        [this.playerOne, this.playerTwo] = players;
    }
}

Main.prototype.toggleResetButton = function() {
    this.resetButton.invertButton();

    if (this.resetButton.isToggled()) {
        this.resetModal.showModal();

        if (this.playButton.isToggled()) {
            this.clickPlayButton();
        }
    } else {
        if (!this.playButton.isToggled()) {
            this.clickPlayButton();
        }
    }
}

Main.prototype.clickResetButton = function() {
    this.resetButton.toggleButton();
}

Main.prototype.closeResetModal = function() {
    if (this.resetButton.isToggled()) {
        this.clickResetButton();
    }
}

Main.prototype.clickNoResetButton = function() {
    this.resetModal.closeModal();
}

Main.prototype.clickYesResetButton = function() {
    this.board.reset();
    this.resetModal.closeModal();
}

Main.prototype.togglePlayButton = function() {
    this.playButton.invertButton();

    if (this.playButton.isToggled()) {
        this.playButton.changeIcon("fa-pause");

        this.board.setState("paused", false);
    } else {
        this.playButton.changeIcon("fa-play");

        this.board.setState("paused", true);
    }
}

Main.prototype.clickPlayButton = function() {
    this.playButton.toggleButton();
}

Main.prototype.keydownPlayButton = function(event) {
    if (event.code !== "Space" || this.spaceKeydown) {
        return;
    }

    this.spaceKeydown = true;

    document.activeElement.blur();
    this.clickPlayButton();
}

Main.prototype.keyupPlayButton = function(event) {
    if (event.code !== "Space") {
        return;
    }

    this.spaceKeydown = false;
}

Main.prototype.toggleUserButton = function() {
    this.userButton.invertButton();

    if (this.userButton.isToggled()) {
        this.playerModal.showModal();

        if (this.playButton.isToggled()) {
            this.clickPlayButton();
        }
    } else {
        if (!this.playButton.isToggled()) {
            this.clickPlayButton();
        }
    }
}

Main.prototype.clickUserButton = function() {
    this.userButton.toggleButton();    
}

Main.prototype.openPlayerModal = function() {
    if (!(this.playerOne && this.playerTwo)) {
        return;
    }

    const nameOne = this.playerOne.name;
    const nameTwo = this.playerTwo.name;

    const players = {
        "playerOne": nameOne === "Player One" ? "" : nameOne,
        "playerTwo": nameTwo === "Player Two" ? "" : nameTwo
    };

    this.playerForm.insertValues(players);
}

Main.prototype.closePlayerModal = function() {
    if (!this.playerOne) {
        this.playerOne = new Player("Player One", "x");
    }

    if (!this.playerTwo) {
        this.playerTwo = new Player("Player Two", "o");
    }

    const players = [this.playerOne, this.playerTwo];
    localStorage.setItem("players", JSON.stringify(players));

    this.playerForm.reset();

    if (this.userButton.isToggled()) {
        this.clickUserButton();
    }
}   

Main.prototype.updatePlayers = function(formData) {
    if (!(formData instanceof FormData) && !formData) {
        throw TypeError("formData argument must be a FormData object.");
    }

    let nameOne = formData.get("playerOne").trim();
    let nameTwo = formData.get("playerTwo").trim();

    if (nameOne.length === 0) {
        nameOne = "Player One";
    }

    if (nameTwo.length === 0) {
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

    cell.setMark(player.mark);

    const winner = this.board.isWinner(player.mark);
    if (winner) {
        this.board.setState("finished", true);
        console.log(`${player.name} won!`);
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

Main.prototype.initializeElements = function(elements) {
    if (!Array.isArray(elements)) {
        throw TypeError("elements argument must be an array.");
    } else if (!elements.every(element => typeof element === "object")) {
        throw TypeError("elements argument must contain objects.");
    } else if (!elements.every(element => "id" in element)) {
        throw TypeError(`elements argument must contain objects that have an "id" key.`);
    } else if (!elements.every(element => "type" in element)) {
        throw TypeError(`elements argument must contain objects that have a "type" key.`);
    } else if (!elements.every(element => typeof element.id === "string")) {
        throw TypeError(`elements argument must contain objects with "id" as a string.`);
    } else if (!elements.every(element => typeof element.type === "string")) {
        throw TypeError(`elements argument must contain objects with "type" as a string.`);
    }

    for (const element of elements) {
        const { id, type } = element;

        const htmlElement = this.getElementById(id);
        this[id] = this.elementFactory(type, htmlElement);
    }
}

Main.prototype.elementFactory = function(type, element) {
    if (typeof type !== "string") {
        throw TypeError("type argument must be a string.");
    } else if (!(element instanceof HTMLElement)) {
        throw TypeError("element argument must be an HTML element.");
    }

    switch (type) {
        case "button": return new Button(element);
        case "modal": return new Modal(element);
        case "form": return new Form(element);
        case "board": return new Board(element);

        default: throw TypeError(`Unknown type: "${type}".`);
    }
}