import { FormGroup } from '../shared/components/FormGroup';
import { gAlert } from '../shared/components/Alert';

import { AuthState } from './AuthState';

export function ResetForm(formContainer, resetToken) {
  const form = document.createElement('form');
  formContainer.append(form);
  let formInputs = [
    {
      type: 'password',
      name: 'password',
      placeholder: 'PokeTeams password',
      labelText: 'New Password',
      minlength: 8,
    },
    {
      type: 'password',
      name: 'password2',
      placeholder: 'PokeTeams password',
      labelText: 'Confirm Password',
      minlength: 8,
    },
  ];
  // Form groups.
  formInputs.forEach((attributes) => {
    form.append(FormGroup(attributes));
  });

  const resetSubmit = document.createElement('input');
  const attributes = {
    type: 'submit',
    value: 'Submit',
    class: 'btn btn-danger btn-block mt-4',
  };
  for (const [key, value] of Object.entries(attributes)) {
    resetSubmit.setAttribute(key, value);
  }
  form.append(resetSubmit);

  form.addEventListener('submit', (e) => submitReset(e, resetToken));
  return form;
}

function submitReset(e, resetToken) {
  e.preventDefault();
  const form = e.target;
  const formContainer = e.target.parentElement;
  const inputs = form.elements;
  if (inputs['password'].value !== inputs['password2'].value) {
    gAlert.update(false, 'The passwords did not match');
    formContainer.insertBefore(gAlert.get(), formContainer.firstElementChild);
  } else {
    const password = inputs['password'].value;
    AuthState.resetPassword(password, resetToken).then((success) => {
      if (success) {
        gAlert.update(true, 'Your password reset.');
      } else {
        gAlert.update(false, 'Unable to reset password.');
      }
      form.reset();
      formContainer.insertBefore(gAlert.get(), formContainer.firstElementChild);
    });
  }
}
