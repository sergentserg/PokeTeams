import { DOMElement } from '../shared/components/DOMElement';
import { FormGroup } from '../shared/components/FormGroup';
import { Alert } from 'src/shared/components/Alert';

import { register } from '../shared/util/auth';

export function RegisterForm(formContainer) {
  // Form header.
  const header = DOMElement('h3', { class: 'text-center' });
  header.innerText = `New trainer approaches`;
  formContainer.append(header);

  const form = document.createElement('form');
  formContainer.append(form);

  let formInputs = [
    {
      type: 'email',
      name: 'email',
      placeholder: 'myemail@domain.com',
      labelText: 'Email',
      required: '',
    },
    {
      type: 'password',
      name: 'password',
      placeholder: 'Pokéteams Password',
      labelText: 'Password',
      required: '',
    },
    {
      type: 'password',
      name: 'password2',
      placeholder: 'Confirm Password',
      labelText: 'Password',
      required: '',
    },
  ];
  formInputs.forEach((attributes) => {
    form.append(FormGroup(attributes));
  });

  form.append(
    DOMElement('input', {
      type: 'submit',
      value: 'Register',
      class: 'btn btn-danger btn-block mt-4',
    })
  );

  form.addEventListener('submit', submitRegister);
  return form;
}

function submitRegister(e) {
  console.log('submitted');
  e.preventDefault();
  const form = e.target;
  const formContainer = e.target.parentElement;
  const inputs = form.elements;
  let alertDiv;
  if (inputs['password'].value !== inputs['password2'].value) {
    alertDiv = Alert(false, 'The passwords did not match');
    formContainer.insertBefore(alertDiv, formContainer.firstElementChild);
  } else {
    const fields = {
      email: inputs['email'].value,
      password: inputs['password'].value,
    };
    register(fields).then((success) => {
      if (success) {
        alertDiv = Alert(true, 'Verify your email to activate account.');
      } else {
        alertDiv = Alert(false, 'Unable to create account.');
      }
      form.reset();
      formContainer.insertBefore(alertDiv, formContainer.firstElementChild);
    });
  }
}
