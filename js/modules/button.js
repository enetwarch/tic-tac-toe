export default function Button(element) {
    if (!new.target) {
        throw Error(`Use the "new" keyword on the Button constructor.`);
    }

    if (!(element instanceof HTMLElement)) {
        throw TypeError("element argument must be an HTMLElement");
    }

    this.element = element;
    this.toggled = false;
}

Button.prototype.addEventListener = function(type, callback) {
    Button.validateEventListenerArguments(type, callback);
    this.element.addEventListener(type, callback);
}

Button.prototype.removeEventListener = function(type, callback) {
    Button.validateEventListenerArguments(type, callback);
    this.element.removeEventListener(type, callback);
}

Button.validateEventListenerArguments = function(type, callback) {
    if (typeof type !== "string") {
        throw TypeError("type argument must be a string.");
    } else if (typeof callback !== "function") {
        throw TypeError("callback argument must be a function.");
    }
}

Button.prototype.click = function() {
    this.element.click();
}

Button.prototype.toggle = function(invertClass = "inverted") {
    if (typeof invertClass !== "string") {
        throw TypeError("invertClass argument needs to be a string.");
    }

    this.setToggled(!this.isToggled());

    const event = new Event("toggle");
    this.element.dispatchEvent(event);

    this.invert(invertClass);
}

Button.prototype.isToggled = function() {
    return this.toggled;
}

Button.prototype.setToggled = function(value) {
    if (typeof value !== "boolean") {
        throw TypeError("value argument must be a boolean.");
    }

    this.toggled = value;
}

Button.prototype.invert = function(invertClass = "inverted") {
    if (typeof invertClass !== "string") {
        throw TypeError("className argument must be a string.");
    }

    this.element.classList.toggle(invertClass);
}

Button.prototype.changeIcon = function(iconClass) {
    if (typeof iconClass !== "string") {
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
    icon.classList.add(iconClass);
}