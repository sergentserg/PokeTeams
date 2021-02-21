import { MAX_FILE_SIZE } from 'src/shared/util/constants';

export default class PhotoUpload {
  constructor() {
    this.form = document.createElement('form');
    this.form.classList = 'form-inline';

    // const group = document.createElement('div');
    // group.classList = 'form-group';
    // this.form.append(group);

    const label = document.createElement('label');
    label.classList = 'mr-2';
    label.setAttribute('for', 'fileUpload');
    label.textContent = 'Profile Photo';
    this.form.append(label);

    const input = document.createElement('input');
    // input.classList = 'form-control-file';
    input.setAttribute('name', 'photoUpload');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.style.display = 'inline';
    this.form.append(input);

    // Small text.
    const small = document.createElement('small');
    small.classList = 'form-text text-muted';
    small.textContent = `Max ${MAX_FILE_SIZE / 1024} KB image`;
    this.form.append(small);
  }

  getComponent() {
    return this.form;
  }
}
