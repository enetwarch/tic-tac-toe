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

export function Form(element) {
    if (!new.target) {
        throw Error(`Use the "new" keyword on the Form constructor.`);
    }

    if (!(element instanceof HTMLElement)) {
        throw TypeError("element argument must be an HTML element.");
    }

    this.element = element;

    this.fields = Array.from(element.querySelectorAll("[name]"));
    if (this.fields.length === 0) {
        throw Error(`${element} form element has no named input fields.`);
    }   
}

Form.prototype.resetForm = function() {
    this.element.reset();
}

Form.prototype.submitForm = function() {
    const submitButton = this.element.querySelector(`button[type="submit"]`);
    if (!submitButton) {
        throw Error(`${this.element} does not have a submit button.`);
    }

    submitButton.click();
}

Form.prototype.changeSubmitListener = function(submit) {
    if (typeof submit !== "function") {
        throw TypeError("submit argument must be a function.");
    }

    this.removeSubmitListener();

    this.submit = event => {
        event.preventDefault();

        const formData = new FormData(this.element);
        submit(formData);

        this.resetForm();
    }

    this.element.addEventListener("submit", this.submit);
}

Form.prototype.removeSubmitListener = function() {
    if (!this.submit) {
        return;
    }

    this.element.removeEventListener("submit", this.submit);
    this.submit = null;
}

Form.prototype.insertValues = function(values) {
    if (typeof values !== "object") {
        throw TypeError("values argument must be an object.");
    } else if (values === null) {
        throw TypeError("values argument cannot be a null object.");
    }

    for (const [key, value] of Object.entries(values)) {
        const field = this.fields.find(field => {
            return field.name === key;
        });

        if (field.length === 0) {
            continue;
        }

        field.value = value;
    }
}