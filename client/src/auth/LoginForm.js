import AuthForm from './AuthForm';

export default class LoginForm extends AuthForm {
  constructor() {
    super([
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
      {
        type: 'submit',
        value: 'Login',
        class: 'btn btn-danger btn-block mt-4',
      },
    ]);

    // Insert after before submit button.
    this.forgotText = document.createElement('small');
    this.forgotText.classList = 'text-right mt-1';
    this.forgotText.innerText = 'Forgot password?';
    const submitBtn = this.form.querySelector('input[type="submit"]');
    this.form.insertBefore(this.forgotText, submitBtn);

    // Insert after submit.
    this.registerText = document.createElement('small');
    this.registerText.classList = 'mt-3 text-center';
    this.registerText.innerText = 'Register for free!';
    this.form.append(this.registerText);
  }
}
