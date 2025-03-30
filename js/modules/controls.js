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
    this.listeners = [];
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

export function Modal(element) {
    if (!new.target) {
        throw Error(`Use the "new" keyword on the Modal constructor.`);
    }

    this.element = element;
    if (!(this.element instanceof HTMLElement)) {
        throw TypeError("element argument must be an HTML element.");
    }

    this.container = this.element.querySelector(".modal-container");
    if (!this.container) {
        throw TypeError(`${this.element} does not have a container.`);
    }

    this.closeButton = this.element.querySelector(".modal-close-button");
    if (!this.closeButton) {
        throw TypeError(`${this.element} does not have a close button.`);
    }

    this.isShown = false;
    this.callback = {
        "open": undefined,
        "close": undefined
    };

    this.addListeners();
}

Modal.prototype.addListeners = function() {
    document.addEventListener("keydown", event => {
        if (event.code !== "Escape") {
            return;
        }

        if (!this.isShown) {
            return;
        }

        event.preventDefault();
        this.closeModal();
    });

    this.element.addEventListener("click", event => {
        if (event.target !== this.element) {
            return;
        }

        this.closeModal();
    });

    this.closeButton.addEventListener("click", () => {
        this.closeModal();
    });
}

Modal.prototype.showModal = function() {
    this.isShown = true;

    this.executeCallback("open");
    this.element.showModal();
}

Modal.prototype.closeModal = function() {
    this.isShown = false;

    console.log("close modal was triggered");
    this.executeCallback("close");
    this.element.close();
}

Modal.prototype.addCallback = function(type, callback) {
    if (typeof type !== "string") {
        throw TypeError("type argument must be a string.");
    } else if (!(type === "open" || type === "close")) {
        throw TypeError(`type argument must be "open" or "close".`);
    } else if (typeof callback !== "function") {
        throw TypeError("callback argument must be a function.");
    }

    this.callback[type] = callback;
}

Modal.prototype.removeCallback = function(type) {
    if (typeof type !== "string") {
        throw TypeError("type argument must be a string.");
    } else if (!(type === "open" || type === "close")) {
        throw TypeError(`type argument must be "open" or "close".`);
    }

    this.callback[type] = () => {}
}

Modal.prototype.executeCallback = function(type) {
    if (typeof type !== "string") {
        throw TypeError("type argument must be a string.");
    } else if (!(type === "open" || type === "close")) {
        throw TypeError(`type argument must be "open" or "close".`);
    }

    if (!this.callback[type]) {
        return;
    }

    this.callback[type]();
}