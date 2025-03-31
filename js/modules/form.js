export default function Form(element) {
    if (!new.target) {
        throw Error(`Use the "new" keyword on the Form constructor.`);
    } else if (!(element instanceof HTMLElement)) {
        throw TypeError("element argument must be an HTML element.");
    }

    this.element = element;

    this.fields = Array.from(this.element.querySelectorAll("[name]"));
    if (this.fields.length === 0) {
        throw Error(`${this.element} form element has no named input fields.`);
    }

    this.submitButton = this.element.querySelector(`button[type="submit"]`);
    if (!this.submitButton) {
        throw Error(`${this.element} form element has no submit button.`);
    }

    this.submitCallback = null;
}

Form.prototype.submit = function() {
    this.submitButton.click();
}

Form.prototype.reset = function() {
    this.element.reset();
}

Form.prototype.onSubmit = function(submit) {
    if (typeof submit !== "function") {
        throw TypeError("submit argument must be a function.");
    } 
    
    if (this.submitCallback) {
        this.element.removeEventListener("submit", this.submitCallback);
    }

    this.submitCallback = function(event) {
        event.preventDefault();

        const formData = new FormData(this.element);
        submit(formData);

        this.reset();
    }.bind(this);

    this.element.addEventListener("submit", this.submitCallback);
}

Form.prototype.insertValues = function(values) {
    if (typeof values !== "object") {
        throw TypeError("values argument must be an object.");
    } else if (values === null) {
        throw TypeError("values argument must not be null.");
    }

    Object.entries(values).forEach(([key, value]) => {
        this.fields.forEach(field => {
            if (field.name === key) {
                field.value = value;
            }
        });
    });
}