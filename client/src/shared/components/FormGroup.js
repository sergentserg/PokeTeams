export function FormGroup(attributes) {
  const formGroup = document.createElement('div');
  formGroup.classList = 'form-group';

  const { labelText, ...inputAttributes } = attributes;
  const inputLabel = document.createElement('label');
  inputLabel.setAttribute('for', inputAttributes.type);
  inputLabel.innerText = labelText;
  formGroup.append(inputLabel);

  const input = document.createElement('input');
  input.classList = 'form-control';
  for (let [key, value] of Object.entries(inputAttributes)) {
    input.setAttribute(key, value);
  }
  formGroup.append(input);
  return formGroup;
}
