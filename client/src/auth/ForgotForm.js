import AuthForm from './AuthForm';

export default class ForgotForm extends AuthForm {
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
        type: 'submit',
        value: 'Submit',
        class: 'btn btn-danger btn-block mt-4',
      },
    ]);
  }
}
