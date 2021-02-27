import { AuthState } from './AuthState';
import ForgotForm from './ForgotForm';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import ResetForm from './ResetForm';
import { gAlert } from '../shared/components/Alert';

export default class AuthView {
  constructor() {
    this.main = document.querySelector('.main');
    this.formHeader = document.createElement('h3');
    this.formHeader.classList = 'text-center';
    this.loginForm = new LoginForm();
    this.registerForm = new RegisterForm();
    this.forgotForm = new ForgotForm();
    this.resetForm = new ResetForm();
    this.resetToken = null;
    this.loadAllEventListeners();
  }

  loadAllEventListeners() {
    this.loginForm.forgotText.addEventListener(
      'click',
      this.showForgot.bind(this)
    );

    this.loginForm.registerText.addEventListener(
      'click',
      this.showRegister.bind(this)
    );

    this.loginForm.get().addEventListener('submit', this.login.bind(this));
    this.registerForm
      .get()
      .addEventListener('submit', this.register.bind(this));
    this.forgotForm.get().addEventListener('submit', this.forgot.bind(this));
    this.resetForm.get().addEventListener('submit', this.reset.bind(this));
  }

  render(resetToken) {
    this.main.append(this.formHeader);
    if (resetToken) {
      this.resetToken = resetToken;
      this.formHeader.textContent = 'Reset Password';
      this.main.append(this.resetForm.get());
    } else {
      this.formHeader.textContent = 'Login to PokeTeams';
      // Form subtext (flavor text?).
      const text = document.createElement('p');
      text.classList = 'text-center text-muted';
      text.textContent = 'Get competitive about Pokemon';
      this.main.insertBefore(text, this.form);

      this.main.append(this.loginForm.get());
    }
  }

  clear() {
    gAlert.get().remove();
    while (this.main.childElementCount > 2) {
      this.main.lastElementChild.remove();
    }
  }

  showForgot() {
    this.clear();
    this.formHeader.textContent = 'Forgot Password?';
    this.main.append(this.forgotForm.get());
  }

  showRegister() {
    this.clear();
    // Form subtext (flavor text?).
    const text = document.createElement('p');
    text.classList = 'text-center text-muted';
    text.textContent = 'Email is used only for login and password recovery.';
    this.formHeader.textContent = 'New Trainer Approaches';
    this.main.insertBefore(text, this.form);
    this.main.append(this.registerForm.get());
  }

  async login(e) {
    e.preventDefault();
    const form = e.target;
    const fields = {
      email: form.elements['email'].value,
      password: form.elements['password'].value,
    };
    const success = await AuthState.login(fields);
    if (!success) {
      gAlert.update(false, 'Invalid credentials');
      this.main.insertBefore(gAlert.get(), this.main.firstElementChild);
    } else {
      window.location.replace('app.html');
    }
  }

  async register(e) {
    e.preventDefault();
    const form = e.target;
    const inputs = form.elements;
    let success = false;
    let alertMsg;
    if (inputs['password'].value !== inputs['password2'].value) {
      alertMsg = 'The passwords did not match';
    } else {
      const fields = {
        email: inputs['email'].value,
        password: inputs['password'].value,
      };
      success = await AuthState.register(fields);
      alertMsg = success
        ? 'Verify your email (check spam)'
        : 'Unable to create account';
      form.reset();
    }
    gAlert.update(success, alertMsg);
    this.main.insertBefore(gAlert.get(), this.main.firstElementChild);
  }

  async forgot(e) {
    e.preventDefault();
    const form = e.target;
    const email = form.elements['email'].value;
    const success = await AuthState.forgotPassword(email);
    const alertMsg = success
      ? 'Email sent (check spam)'
      : 'An email was not sent';
    form.reset();
    gAlert.update(success, alertMsg);
    this.main.insertBefore(gAlert.get(), this.main.firstElementChild);
  }

  async reset(e) {
    e.preventDefault();
    const form = e.target;
    const inputs = form.elements;
    let success = false;
    let alertMsg;
    if (inputs['password'].value !== inputs['password2'].value) {
      alertMsg = 'The passwords did not match';
    } else {
      const password = inputs['password'].value;
      success = await AuthState.resetPassword(password, this.resetToken);
      alertMsg = success ? 'Your password reset' : 'Unable to reset password';
      form.reset();
    }
    gAlert.update(success, alertMsg);
    this.main.insertBefore(gAlert.get(), this.main.firstElementChild);
  }
}
