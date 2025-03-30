export default function Cell(coordinates) {
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