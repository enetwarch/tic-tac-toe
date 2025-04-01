export default function Player(name, mark) {
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

    this.turn = false;
}

Player.prototype.getName = function() {
    return this.name;
}

Player.prototype.getMark = function() {
    return this.mark;
}

Player.prototype.getTurn = function() {
    return this.turn;
}

Player.prototype.setName = function(name) {
    if (typeof name !== "string") {
        throw TypeError("name argument must be a string.");
    }

    this.name = name;
}

Player.prototype.setMark = function(mark) {
    if (typeof mark !== "string") {
        throw TypeError("mark argument must be a string.");
    } else if (!["x", "o"].includes(mark)) {
        throw TypeError(`mark argmust must only be "x" or "o".`);
    }

    this.mark = mark;
}

Player.prototype.setTurn = function(turn) {
    if (typeof turn !== "boolean") {
        throw TypeError("turn argument must be a boolean.");
    }

    this.turn = turn;
}