import { register } from '../shared/util/auth';
import { Form } from '../shared/components/Form';

export function RegisterForm() {
  let inputOpts = [
    {
      type: 'email',
      name: 'email',
      placeholder: 'myemail@domain.com',
      label: 'Email',
    },
    {
      type: 'password',
      name: 'password',
      placeholder: 'Pokéteams Password',
      label: 'Password',
    },
    {
      type: 'password',
      name: 'password2',
      placeholder: 'Confirm Password',
      label: 'Password',
    },
  ];
  const header = document.createElement('h3');
  header.classList = 'text-center';
  header.innerText = `New trainer approaches`;

  const form = Form(inputOpts, 'Register');

  form.insertBefore(header, form.firstElementChild);
  form.addEventListener('submit', register);
  return form;
}
