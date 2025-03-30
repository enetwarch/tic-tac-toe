export function Player(name, mark) {
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

export function Button(element) {
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

    this.removeListener();

    this.listener = () => {
        callback();
    }

    this.element.addEventListener("click", this.listener);
}

Button.prototype.toggleButtonListener = function(callback, className = "inverted") {
    if (typeof callback !== "function") {
        throw TypeError("callback argument must be a function.");
    }

    this.removeListener();

    this.listener = () => {
        this.element.classList.toggle(className);
        this.isToggled = !this.isToggled;

        callback(this.isToggled);
    }

    this.element.addEventListener("click", this.listener);
}

Button.prototype.removeListener = function() {
    if (!this.listener) {
        return;
    }

    this.removeEventListener("click", this.listener);
    this.listener = null;
}