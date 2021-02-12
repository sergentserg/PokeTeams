import { Form } from '../shared/components/Form';
import { login } from '../shared/util/auth';

export function LoginForm() {
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
  ];
  const header = document.createElement('h3');
  header.classList = 'text-center';
  header.innerText = `Login to PokeTeams`;

  const text = document.createElement('p');
  text.classList = 'text-center text-muted';
  text.innerText = 'Get competitive about Pokemon';

  const form = Form(inputOpts, 'Login');
  form.insertBefore(text, form.firstElementChild);
  form.insertBefore(header, form.firstElementChild);

  // <h3 class="text-center">Sign in to PokeTeams</h3>
  // <p class="text-muted text-center">Get competitive about Pokemon.</p>
  form.addEventListener('submit', login);
  return form;
}
