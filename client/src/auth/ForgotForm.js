import { DOMElement } from '../shared/components/DOMElement';
import { FormGroup } from '../shared/components/FormGroup';
import { Alert } from 'src/shared/components/Alert';

import { forgotPassword } from './AuthState';

export function ForgotForm(formContainer) {
  const header = DOMElement('h3', { class: 'text-center' });
  header.innerText = 'Forgotten Password';
  formContainer.append(header);

  const form = document.createElement('form');
  formContainer.append(form);

  form.append(
    FormGroup({
      type: 'email',
      name: 'email',
      placeholder: 'myemail@domain.com',
      labelText: 'Email',
    })
  );

  form.append(
    DOMElement('input', {
      type: 'submit',
      value: 'Submit',
      class: 'btn btn-danger btn-block mt-4',
    })
  );

  form.addEventListener('submit', submitForgot);
  return form;
}

function submitForgot(e) {
  e.preventDefault();
  const form = e.target;
  const formContainer = form.parentElement;
  const email = form.elements['email'].value;
  forgotPassword(email).then((success) => {
    const alertMsg = success ? 'Email sent' : 'An email was not sent';
    const alertDiv = Alert(success, alertMsg);
    formContainer.insertBefore(alertDiv, formContainer.firstElementChild);
    form.reset();
  });
}
