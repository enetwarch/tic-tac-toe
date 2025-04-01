import elements from "../data/elements.json" with { "type": "json" };
import Player from "../modules/player.js";
import Button from "../modules/button.js";
import Modal from "../modules/modal.js";
import Form from "../modules/form.js";

export default function UI(players) {
    if (!new.target) {
        throw Error(`Use the "new" keyword on the UI constructor.`);
    }

    if (!Array.isArray(players)) {
        throw TypeError("players argument must be an array.");
    } else if (!players.every(player => player instanceof Player)) {
        throw TypeError("players argument must only have Player objects as elements.");
    }

    this.players = players;

    this.initializeElements(elements);
    
    this.resetButton.addEventListener("toggle", this.onResetButtonToggle.bind(this));
    this.resetButton.addEventListener("click", this.onResetButtonClick.bind(this));
    this.resetModal.addEventListener("close", this.onResetModalClose.bind(this));
    this.noResetButton.addEventListener("click", this.onNoResetButtonClick.bind(this));
    this.yesResetButton.addEventListener("click", this.onYesResetButtonClick.bind(this));

    this.playButton.addEventListener("toggle", this.onPlayButtonToggle.bind(this));
    this.playButton.addEventListener("click", this.onPlayButtonClick.bind(this));
    document.addEventListener("keydown", this.onDocumentKeydown.bind(this));
    document.addEventListener("keyup", this.onDocumentKeyup.bind(this));

    this.userButton.addEventListener("toggle", this.onUserButtonToggle.bind(this));
    this.userButton.addEventListener("click", this.onUserButtonClick.bind(this));
    this.playerModal.addEventListener("show", this.onPlayerModalShow.bind(this));
    this.playerModal.addEventListener("close", this.onPlayerModalClose.bind(this));
    this.playerForm.onSubmit(this.onPlayerFormSubmit.bind(this));
}

UI.prototype.onResetButtonToggle = function() {
    if (this.resetButton.isToggled()) {
        this.resetModal.show();

        if (this.playButton.isToggled()) {
            this.playButton.click();
        }
    } else {
        if (!this.playButton.isToggled()) {
            this.playButton.click();
        }
    }
}

UI.prototype.onResetButtonClick = function() {
    this.resetButton.toggle();
}

UI.prototype.onResetModalClose = function() {
    if (this.resetButton.isToggled()) {
        this.resetButton.click();
    }
}

UI.prototype.onNoResetButtonClick = function() {
    this.resetModal.close();
}

UI.prototype.onYesResetButtonClick = function() {
    const event = new Event("gamereset");
    document.dispatchEvent(event);

    this.resetModal.close();
}

UI.prototype.onPlayButtonToggle = function() {
    if (this.playButton.isToggled()) {
        this.playButton.changeIcon("fa-pause");

        const event = new Event("gameresume");
        document.dispatchEvent(event);
    } else {
        this.playButton.changeIcon("fa-play");

        const event = new Event("gamepause");
        document.dispatchEvent(event);
    }
}

UI.prototype.onPlayButtonClick = function() {
    this.playButton.toggle();
}

UI.prototype.onDocumentKeydown = function(event) {
    if (event.code === "Space" && !this.spaceKeydown) {
        this.spaceKeydown = true;

        event.preventDefault();
        document.activeElement.blur();

        this.clickPlayButton();
    }
}

UI.prototype.onDocumentKeyup = function(event) {
    if (event.code === "Space") {
        this.spaceKeydown = false;
    }
}

UI.prototype.onUserButtonToggle = function() {
    if (this.userButton.isToggled()) {
        this.playerModal.show();

        if (this.playButton.isToggled()) {
            this.playButton.click();
        }
    } else {
        if (!this.playButton.isToggled()) {
            this.playButton.click();
        }
    }
}

UI.prototype.onUserButtonClick = function() {
    this.userButton.toggle();    
}

UI.prototype.onPlayerModalShow = function() {
    const playerOneName = this.players[0].getName();
    const playerTwoName = this.players[1].getName();

    const players = {
        "playerOne": playerOneName === "Player 1" ? "" : playerOneName,
        "playerTwo": playerTwoName === "Player 2" ? "" : playerTwoName
    };

    this.playerForm.insertValues(players);
}

UI.prototype.onPlayerModalClose = function() {
    this.playerForm.reset();

    if (this.userButton.isToggled()) {
        this.userButton.click();
    }
}

UI.prototype.onPlayerFormSubmit = function(formData) {
    if (!(formData instanceof FormData)) {
        throw TypeError("formData argument must be a FormData object.");
    }

    const nameOne = formData.get("playerOne").trim();
    const nameTwo = formData.get("playerTwo").trim();

    const playerOne = this.players[0];
    const playerTwo = this.players[1];

    playerOne.setName(nameOne || "Player 1");
    playerTwo.setName(nameTwo || "Player 2");

    try {
        localStorage.setItem("players", JSON.stringify(this.players));
    } catch (error) {
        console.error(`Local storage failed to save: ${error} error.`);
    }

    const event = new Event("gamereset");
    document.dispatchEvent(event);

    this.playerModal.close();
}

UI.prototype.initializeElements = function(elements) {
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

        const htmlElement = UI.getElementById(id);
        this[id] = UI.elementFactory(type, htmlElement);
    }
}

UI.getElementById = function(id) {
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

UI.elementFactory = function(type, element) {
    if (typeof type !== "string") {
        throw TypeError("type argument must be a string.");
    } else if (!(element instanceof HTMLElement)) {
        throw TypeError("element argument must be an HTML element.");
    }

    switch (type) {
        case "button": return new Button(element);
        case "modal": return new Modal(element);
        case "form": return new Form(element);

        default: throw TypeError(`Unknown type: "${type}".`);
    }
}