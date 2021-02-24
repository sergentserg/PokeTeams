export default class TeamAddForm {
  constructor() {
    this.form = document.createElement('form');
    this.form.classList = 'form-inline';

    // ---- Name Input Group ----
    const group = document.createElement('div');
    this.form.append(group);
    group.classList = 'form-group';

    const label = document.createElement('label');
    group.append(label);
    label.classList = 'mr-2';
    label.setAttribute('for', 'teamName');
    label.textContent = 'Team Name';

    // 50 characters max on input.
    let input = document.createElement('input');
    group.append(input);
    input.classList = 'form-control mr-2';
    input.setAttribute('type', 'text');
    input.setAttribute('name', 'teamName');
    input.setAttribute('maxlength', '50');
    input.setAttribute('required', '');

    input = document.createElement('input');
    this.form.append(input);
    input.setAttribute('type', 'submit');
    input.classList = 'btn btn-primary mr-2';
    input.setAttribute('value', 'Submit');
  }

  getComponent() {
    return this.form;
  }
}
