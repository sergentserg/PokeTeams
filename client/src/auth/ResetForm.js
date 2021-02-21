import { FormGroup } from '../shared/components/FormGroup';
import { DOMElement } from '../shared/components/DOMElement';
import { Alert } from 'src/shared/components/Alert';

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
    },
    {
      type: 'password',
      name: 'password2',
      placeholder: 'PokeTeams password',
      labelText: 'Confirm Password',
    },
  ];
  // Form groups.
  formInputs.forEach((attributes) => {
    form.append(FormGroup(attributes));
  });

  form.append(
    DOMElement('input', {
      type: 'submit',
      value: 'Submit',
      class: 'btn btn-danger btn-block mt-4',
    })
  );

  form.addEventListener('submit', (e) => submitReset(e, resetToken));
  return form;
}

function submitReset(e, resetToken) {
  e.preventDefault();
  const form = e.target;
  const formContainer = e.target.parentElement;
  const inputs = form.elements;
  let alertDiv;
  if (inputs['password'].value !== inputs['password2'].value) {
    alertDiv = Alert(false, 'The passwords did not match');
    formContainer.insertBefore(alertDiv, formContainer.firstElementChild);
  } else {
    const password = inputs['password'].value;
    AuthState.resetPassword(password, resetToken).then((success) => {
      if (success) {
        alertDiv = Alert(true, 'Your password reset.');
      } else {
        alertDiv = Alert(false, 'Unable to reset password.');
      }
      form.reset();
      formContainer.insertBefore(alertDiv, formContainer.firstElementChild);
    });
  }
}
