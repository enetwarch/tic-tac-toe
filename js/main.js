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

    const componentConfig = [
        ["resetButton", "button"],
        ["playButton", "button"],
        ["userButton", "button"],
        ["noResetButton", "button"],
        ["yesResetButton", "button"],
        ["confirmPlayerButton", "button"],
        ["resetModal", "modal"],
        ["playerModal", "modal"],
        ["playerForm", "form"],
        ["board", "board"]
    ];

    this.initializeComponents(componentConfig);
    
    this.resetButton.addListener("click", this.clickResetButton.bind(this));
    this.resetModal.addCallback("close", this.closeResetModal.bind(this));
    this.noResetButton.addListener("click", this.clickNoResetButton.bind(this));
    this.yesResetButton.addListener("click", this.clickYesResetButton.bind(this));

    this.userButton.addListener("click", this.clickUserButton.bind(this));
    this.playerModal.addCallback("open", this.openPlayerModal.bind(this));
    this.playerModal.addCallback("close", this.closePlayerModal.bind(this));
    this.playerForm.changeSubmitListener(this.updatePlayers.bind(this));

    this.playerOneTurn = true;
    this.board.updateClickListener(this.playTurn.bind(this));

    const players = JSON.parse(localStorage.getItem("players"));
    if (!players) {
        this.userButton.invertButton();
        this.playerModal.showModal();    
    } else {
        [this.playerOne, this.playerTwo] = players;
    }
}

Main.prototype.clickResetButton = function() {
    this.resetButton.invertButton();
    this.resetModal.showModal();
}

Main.prototype.closeResetModal = function() {
    this.resetButton.invertButton();
}

Main.prototype.clickNoResetButton = function() {
    this.resetModal.closeModal();
}

Main.prototype.clickYesResetButton = function() {
    this.board.resetBoard();
    this.resetModal.closeModal();
}

Main.prototype.clickUserButton = function() {
    this.userButton.invertButton();
    this.playerModal.showModal();
}

Main.prototype.openPlayerModal = function() {
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
}

Main.prototype.closePlayerModal = function() {
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

Main.prototype.initializeComponents = function(componentConfig) {
    if (!Array.isArray(componentConfig)) {
        throw TypeError("componentConfig argument must be an array.");
    } else if (!componentConfig.every(config => config.length === 2)) {
        throw TypeError("componentConfig argument inner arrays must be 2 length.");
    } else if (!componentConfig.flat(1).every(element => typeof element === "string")) {
        throw TypeError("componentConfig argument inner arrays must be strings.");
    }

    for (const component of componentConfig) {
        const [id, type] = component;

        const element = this.getElementById(id);
        this[id] = this.componentFactory(type, element);
    }
}

Main.prototype.componentFactory = function(type, element) {
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