export default function Button(element) {
    if (!new.target) {
        throw Error(`Use the "new" keyword on the Button constructor.`);
    }

    if (!(element instanceof HTMLElement)) {
        throw TypeError("element argument must be an HTMLElement");
    }

    this.element = element;
    this.listeners = [];
}

Button.prototype.addToggleState = function(callback) {
    if (typeof callback !== "function") {
        throw TypeError("callback argument must be a function.");
    }

    this.toggled = false;
    this.toggleState = callback;
}

Button.prototype.toggleButton = function() {
    if (!this.toggleState) {
        throw Error(`${this.element} does not have a toggle state.`);
    }

    this.toggled = !this.toggled;
    this.toggleState();
}

Button.prototype.isToggled = function() {
    return this.toggled;
}

Button.prototype.addListener = function(type, callback) {
    if (typeof type !== "string") {
        throw TypeError("type argument must be a string.");
    } else if (typeof callback !== "function") {
        throw TypeError("callback argumnent must be a function.");
    }

    this.listeners.push([type, callback]);
    this.element.addEventListener(type, callback);
}

Button.prototype.invertButton = function(className = "inverted") {
    if (typeof className !== "string") {
        throw TypeError("className argument must be a string.");
    }

    this.element.classList.toggle(className);
}

Button.prototype.removeListeners = function() {
    if (!this.listener) {
        return;
    }

    this.listeners.forEach(listener => {
        const [type, callback] = listener;
        this.removeEventListener(type, callback);
    });

    this.listeners = [];
}

Button.prototype.changeIcon = function(className) {
    if (typeof className !== "string") {
        throw TypeError("className argument must be a string.");
    }

    const icon = this.element.querySelector("i");
    if (!icon) {
        throw Error(`${this.element} does not have an icon.`);
    } else if (icon.classList.length === 0) {
        throw Error(`${icon} icon does not have any class.`);
    }

    const lastElement = icon.classList[icon.classList.length - 1];
    icon.classList.remove(lastElement);
    icon.classList.add(className);
}