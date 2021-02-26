import AuthForm from './AuthForm';

export default class RegisterForm extends AuthForm {
  constructor() {
    super([
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
      {
        type: 'submit',
        value: 'Register',
        class: 'btn btn-danger btn-block mt-4',
      },
    ]);
  }
}
