import { DOMElement } from './DOMElement';

export function FormGroup(attributes) {
  const formGroup = DOMElement('div', { class: 'form-group' });

  const { labelText, ...inputAttributes } = attributes;
  const inputLabel = DOMElement('label', { for: inputAttributes.type });
  inputLabel.innerText = labelText;
  formGroup.append(inputLabel);

  formGroup.append(
    DOMElement('input', { class: 'form-control', ...inputAttributes })
  );
  return formGroup;
}
