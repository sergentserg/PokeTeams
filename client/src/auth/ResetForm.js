import AuthForm from './AuthForm';

export default class ResetForm extends AuthForm {
  constructor() {
    super([
      {
        type: 'password',
        name: 'password',
        placeholder: 'PokeTeams password',
        labelText: 'New Password',
        minlength: 8,
      },
      {
        type: 'password',
        name: 'password2',
        placeholder: 'PokeTeams password',
        labelText: 'Confirm Password',
        minlength: 8,
      },
      {
        type: 'submit',
        value: 'Submit',
        class: 'btn btn-danger btn-block mt-4',
      },
    ]);
  }
}
