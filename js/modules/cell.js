export default function Cell(coordinates, elementClass = "board-cell") {
    if (!new.target) {
        throw Error(`Use the "new" keyword on the Cell constructor.`);
    }

    if (!Array.isArray(coordinates)) {
        throw TypeError("coordinates argument must be an array.");
    } else if (coordinates.length !== 2) {
        throw TypeError("coordinates argument must only contain 2 values");
    } else if (!coordinates.every(coordinate => typeof coordinate === "number")) {
        throw TypeError("coordinates argument must have number values");
    } else if (typeof elementClass !== "string") {
        throw TypeError("elementClass argument must be a string.");
    }

    this.element = document.createElement("button");
    this.element.classList.add(elementClass);
    this.element.type = "button";
    this.element.dataset.coordinates = JSON.stringify(coordinates);

    this.icon = document.createElement("i");
    this.element.appendChild(this.icon);

    this.mark = "";
}

Cell.prototype.getElement = function() {
    return this.element;
}

Cell.prototype.getCoordinates = function() {
    return JSON.parse(this.element.dataset.coordinates);
}

Cell.prototype.getMark = function() {
    return this.mark;
}

Cell.prototype.setMark = function(mark) {
    if (this.mark !== "") return;

    const classList = Cell.getMarkClasses(mark);
    this.icon.classList.add(...classList);

    this.mark = mark;
}

Cell.prototype.reset = function() {
    if (this.mark === "") return;

    this.icon.className = "";
    this.mark = "";
}

Cell.getMarkClasses = function(mark) {
    if (typeof mark !== "string") {
        throw TypeError("mark argument needs to be a string.");
    }

    switch (mark) {
        case "x": return ["x-icon", "fa-solid", "fa-x"];
        case "o": return ["o-icon", "fa-solid", "fa-o"];

        default: throw TypeError(`mark argument only accepts "x" and "o" values.`);
    }
}