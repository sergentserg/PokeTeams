import { FormGroup } from '../shared/components/FormGroup';
import { gAlert } from '../shared/components/Alert';

import { AuthState } from './AuthState';

export function RegisterForm(formContainer) {
  // Form header.
  const header = document.createElement('h3');
  header.classList = 'text-center';
  header.textContent = `New trainer approaches`;
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
      minlength: 8,
      required: '',
    },
    {
      type: 'password',
      name: 'password2',
      placeholder: 'Confirm Password',
      labelText: 'Password',
      minlength: 8,
      required: '',
    },
  ];
  formInputs.forEach((attributes) => {
    form.append(FormGroup(attributes));
  });

  const registerSubmit = document.createElement('input');
  const attributes = {
    type: 'submit',
    value: 'Register',
    class: 'btn btn-danger btn-block mt-4',
  };
  for (const [key, value] of Object.entries(attributes)) {
    registerSubmit.setAttribute(key, value);
  }
  form.append(registerSubmit);

  form.addEventListener('submit', submitRegister);
  return form;
}

function submitRegister(e) {
  e.preventDefault();
  const form = e.target;
  const formContainer = e.target.parentElement;
  const inputs = form.elements;
  if (inputs['password'].value !== inputs['password2'].value) {
    gAlert.update(false, 'The passwords did not match');
    formContainer.insertBefore(gAlert.get(), formContainer.firstElementChild);
  } else {
    const fields = {
      email: inputs['email'].value,
      password: inputs['password'].value,
    };
    AuthState.register(fields).then((success) => {
      if (success) {
        gAlert.update(true, 'Verify your email to activate account.');
      } else {
        gAlert.update(false, 'Unable to create account.');
      }
      form.reset();
      formContainer.insertBefore(gAlert.get(), formContainer.firstElementChild);
    });
  }
}
