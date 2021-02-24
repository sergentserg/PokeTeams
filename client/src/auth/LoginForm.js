import { FormGroup } from '../shared/components/FormGroup';
import { RegisterForm } from './RegisterForm';
import { ForgotForm } from './ForgotForm';
import { gAlert } from '../shared/components/Alert';

import { AuthState } from './AuthState';

export function LoginForm(formContainer) {
  // Form header.
  const header = document.createElement('h3');
  header.classList = 'text-center';
  header.innerText = `Login to PokeTeams`;
  formContainer.append(header);

  // Form subtext (flavor text?).
  const text = document.createElement('p');
  text.classList = 'text-center text-muted';
  text.textContent = 'Get competitive about Pokemon';
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
  const forgotText = document.createElement('small');
  forgotText.classList = 'text-right mt-1';
  forgotText.innerText = 'Forgot password?';
  forgotText.addEventListener('click', (e) => {
    while (formContainer.firstChild) {
      formContainer.removeChild(formContainer.firstChild);
    }
    ForgotForm(formContainer);
  });
  form.append(forgotText);

  // Submit button.
  const loginSubmit = document.createElement('input');
  const attributes = {
    type: 'submit',
    value: 'Login',
    class: 'btn btn-danger btn-block mt-4',
  };
  for (const [key, value] of Object.entries(attributes)) {
    loginSubmit.setAttribute(key, value);
  }
  form.append(loginSubmit);

  // Replace login form with register form onclick.
  const registerText = document.createElement('small');
  registerText.classList = 'mt-3 text-center';
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
  AuthState.login(fields).then((success) => {
    if (!success) {
      const formContainer = form.parentElement;
      gAlert.update(false, 'Invalid credentials');
      formContainer.insertBefore(gAlert.get(), formContainer.firstElementChild);
    } else {
      window.location.replace('app.html');
    }
  });
}
