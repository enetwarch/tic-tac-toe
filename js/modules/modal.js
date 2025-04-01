export default function Modal(element, containerQuery = ".modal-container", closeButtonQuery = ".modal-close-button") {
    if (!new.target) {
        throw Error(`Use the "new" keyword on the Modal constructor.`);
    }

    if (!(element instanceof HTMLElement)) {
        throw TypeError("element argument must be an HTML element.");
    } else if (typeof containerQuery !== "string") {
        throw TypeError("containerQuery argument must be a string.");
    } else if (typeof closeButtonQuery !== "string") {
        throw TypeError("closeButtonQuery argument must be a string.");
    }

    this.element = element;

    this.container = this.element.querySelector(containerQuery);
    if (!this.container) {
        throw TypeError(`element argument does not have a container with "${containerQuery}" query.`);
    }

    this.closeButton = this.element.querySelector(closeButtonQuery);
    if (!this.closeButton) {
        throw TypeError(`element argument does not have a close button with "${closeButtonQuery}" query.`);
    }

    this.shown = false;

    document.addEventListener("keydown", this.onEscapeKey.bind(this));
    this.element.addEventListener("click", this.onOverlayClick.bind(this));
    this.closeButton.addEventListener("click", this.onCloseButtonClick.bind(this));
}

Modal.prototype.show = function() {
    if (this.shown) return;

    this.setShown(true);
    this.element.showModal();

    const event = new Event("show");
    this.element.dispatchEvent(event);
}

Modal.prototype.close = function() {
    if (!this.shown) return;

    this.setShown(false);
    this.element.close();

    const event = new Event("close");
    this.element.dispatchEvent(event);
}

Modal.prototype.isShown = function() {
    return this.shown;
}

Modal.prototype.setShown = function(value) {
    if (typeof value !== "boolean") {
        throw TypeError("value argument must be a boolean.");
    }

    this.shown = value;
}

Modal.prototype.addEventListener = function(type, callback) {
    Modal.validateEventListenerArguments(type, callback);
    this.element.addEventListener(type, callback);
}

Modal.prototype.removeEventListener = function(type, callback) {
    Modal.validateEventListenerArguments(type, callback);
    this.element.removeEventListener(type, callback);
}

Modal.validateEventListenerArguments = function(type, callback) {
    if (typeof type !== "string") {
        throw TypeError("type argument must be a string.");
    } else if (!["show", "close"].includes(type)) {
        throw TypeError(`type argument must only be "show" or "close"`);
    } else if (typeof callback !== "function") {
        throw TypeError("callback argument must be a function.");
    }
}

Modal.prototype.onEscapeKey = function(event) {
    if (event.code === "Escape" && this.isShown()) {
        event.preventDefault();
        this.close();
    }
}

Modal.prototype.onOverlayClick = function(event) {
    if (event.target === this.element) {
        this.close();
    }
}

Modal.prototype.onCloseButtonClick = function() {
    this.close();
}