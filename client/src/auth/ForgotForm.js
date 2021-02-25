import { FormGroup } from '../shared/components/FormGroup';
import { gAlert } from '../shared/components/Alert';

import { AuthState } from './AuthState';

export function ForgotForm(formContainer) {
  const header = document.createElement('h3');
  header.classList = 'text-center';

  header.textContent = 'Forgotten Password';
  formContainer.append(header);

  const form = document.createElement('form');
  formContainer.append(form);

  form.append(
    FormGroup({
      type: 'email',
      name: 'email',
      placeholder: 'myemail@domain.com',
      labelText: 'Email',
      required: '',
    })
  );

  const forgotSubmit = document.createElement('input');
  const attributes = {
    type: 'submit',
    value: 'Submit',
    class: 'btn btn-danger btn-block mt-4',
  };
  for (const [key, value] of Object.entries(attributes)) {
    forgotSubmit.setAttribute(key, value);
  }
  form.append(forgotSubmit);

  form.addEventListener('submit', submitForgot);
  return form;
}

function submitForgot(e) {
  e.preventDefault();
  const form = e.target;
  const formContainer = form.parentElement;
  const email = form.elements['email'].value;
  AuthState.forgotPassword(email).then((success) => {
    const alertMsg = success ? 'Email sent' : 'An email was not sent';
    gAlert.update(success, alertMsg);
    formContainer.insertBefore(gAlert.get(), formContainer.firstElementChild);
    form.reset();
  });
}
