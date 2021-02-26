export default class AuthForm {
  constructor(inputs) {
    this.form = document.createElement('form');

    // Form groups.
    inputs.forEach((attributes) => {
      const { labelText, ...inputAttributes } = attributes;
      // Form input.
      const input = document.createElement('input');
      input.classList = 'form-control';
      for (let [key, value] of Object.entries(inputAttributes)) {
        input.setAttribute(key, value);
      }

      let element = input;
      if (labelText) {
        // Form group.
        element = document.createElement('div');
        element.classList = 'form-group';

        // Input label.
        const label = document.createElement('label');
        label.setAttribute('for', inputAttributes.type);
        label.textContent = labelText;
        element.append(label);
        element.append(input);
      }
      this.form.append(element);
    });
  }

  get() {
    return this.form;
  }
}
