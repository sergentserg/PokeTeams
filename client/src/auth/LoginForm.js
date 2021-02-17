import { DOMElement } from '../shared/components/DOMElement';
import { FormGroup } from '../shared/components/FormGroup';
import { RegisterForm } from './RegisterForm';
import { ForgotForm } from './ForgotForm';
import { Alert } from 'src/shared/components/Alert';

import { login } from './AuthState';

export function LoginForm(formContainer) {
  // Form header.
  const header = DOMElement('h3', { class: 'text-center' });
  header.innerText = `Login to PokeTeams`;
  formContainer.append(header);

  // Form subtext (flavor text?).
  const text = DOMElement('p', { class: 'text-center text-muted' });
  text.innerText = 'Get competitive about Pokemon';
  formContainer.append(text);

  const form = document.createElement('form');
  formContainer.append(form);

  // Form Inputs.
  let formInputs = [
    {
      type: 'email',
      name: 'email',
      placeholder: 'myemail@domain.com',
      labelText: 'Email',
      class: 'form-control',
      required: '',
    },
    {
      type: 'password',
      name: 'password',
      placeholder: 'Pokéteams Password',
      labelText: 'Password',
      class: 'form-control',
      required: '',
    },
  ];

  // Form groups.
  formInputs.forEach((attributes) => {
    form.append(FormGroup(attributes));
  });
  // Forgot password?
  const forgotText = DOMElement('small', { class: 'text-right mt-1' });
  forgotText.innerText = 'Forgot password?';
  forgotText.addEventListener('click', (e) => {
    while (formContainer.firstChild) {
      formContainer.removeChild(formContainer.firstChild);
    }
    ForgotForm(formContainer);
  });
  form.append(forgotText);

  // Submit button.
  form.append(
    DOMElement('input', {
      type: 'submit',
      value: 'Login',
      class: 'btn btn-danger btn-block mt-4',
    })
  );

  // Replace login form with register form onclick.
  const registerText = DOMElement('small', { class: 'mt-3 text-center' });
  registerText.innerText = 'Register for free!';
  registerText.addEventListener('click', (e) => {
    while (formContainer.firstChild) {
      formContainer.removeChild(formContainer.firstChild);
    }
    RegisterForm(formContainer);
  });
  form.append(registerText);

  form.addEventListener('submit', submitLogin);
  return formContainer;
}

function submitLogin(e) {
  e.preventDefault();
  const form = e.target;
  const fields = {
    email: form.elements['email'].value,
    password: form.elements['password'].value,
  };
  login(fields).then((success) => {
    if (!success) {
      const formContainer = form.parentElement;
      const alertDiv = Alert(false, 'Invalid credentials');
      formContainer.insertBefore(alertDiv, formContainer.firstElementChild);
    } else {
      window.location.replace('app.html');
    }
  });
}
