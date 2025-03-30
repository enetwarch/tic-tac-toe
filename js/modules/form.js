export default function Form(element) {
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