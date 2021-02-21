// Photo
// Trainer Name
// Email (requires confirmation).

export default class DetailsForm {
  constructor(name) {
    this.form = document.createElement('form');
    this.form.classList = 'form-inline mb-2';

    // ---- Name Input Group ----
    const group = document.createElement('div');
    group.classList = 'form-group';
    this.form.append(group);

    const label = document.createElement('label');
    label.classList = 'mr-2';
    label.setAttribute('for', 'trainerName');
    label.textContent = 'Trainer Name';
    group.append(label);

    // 50 characters max on input.
    let input = document.createElement('input');
    input.classList = 'form-control mr-2';
    input.setAttribute('type', 'text');
    input.setAttribute('name', 'trainerName');
    input.setAttribute('maxlength', '50');
    input.setAttribute('required', '');
    input.value = name;
    group.append(input);

    input = document.createElement('input');
    input.setAttribute('type', 'submit');
    input.classList = 'btn btn-primary';
    input.setAttribute('value', 'Update');
    this.form.append(input);
  }

  getComponent() {
    return this.form;
  }
}
