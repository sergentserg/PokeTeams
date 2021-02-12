export function Form(inputOpts, submitValue) {
  // Create form (input) groups.
  let formGroups = [];
  inputOpts.forEach((options) => {
    const inputLabel = document.createElement('label');
    inputLabel.setAttribute('for', options.type);
    inputLabel.innerText = options.label;

    const input = FormInput(options);

    const formGroup = document.createElement('div');
    formGroup.classList = 'form-group';
    formGroup.append(inputLabel);
    formGroup.append(input);
    formGroups.push(formGroup);
  });

  // Form submission button.
  const submitBtn = FormSubmit(submitValue);

  // Build up form.
  const form = document.createElement('form');
  form.id = 'loginForm';
  formGroups.forEach((formGroup) => form.append(formGroup));
  form.append(submitBtn);
  return form;
}

export function FormInput(options) {
  const { type, placeholder, name } = options;
  const input = document.createElement('input');
  input.classList = 'form-control';
  input.setAttribute('type', type);
  input.setAttribute('name', name);
  input.setAttribute('placeholder', placeholder);
  input.required = true;
  return input;
}

export function FormSubmit(value) {
  const submitBtn = document.createElement('input');
  submitBtn.classList = 'btn btn-danger btn-block mt-4';
  submitBtn.setAttribute('type', 'submit');
  submitBtn.setAttribute('value', value);
  return submitBtn;
}
