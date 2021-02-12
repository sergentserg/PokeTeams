import './login.scss';
import { Navbar } from '../shared/components/Navbar';
import { activate, authenticate } from '../shared/util/auth';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { getSearchParams } from '../shared/util/getSearchParams';

authenticate().then((isLoggedIn) => {
  if (isLoggedIn) {
    window.replace('profile.html');
  } else {
    // Display Nav.
    const navbar = Navbar(isLoggedIn);
    document.body.insertBefore(navbar, document.body.firstChild);
    navbar
      .querySelector('.fa-sign-in-alt')
      .closest('a')
      .classList.add('active');
    // Display Login form by default.
    const loginForm = LoginForm();

    // Replace login form with register form onclick.
    const a = document.createElement('a');
    a.classList = 'd-block mt-3 text-center small';
    a.innerText = 'Register for free!';

    a.addEventListener('click', (e) => {
      e.preventDefault();
      loginForm.replaceWith(RegisterForm());
    });
    loginForm.append(a);

    const loginSection = document.querySelector('.login-container');
    loginSection.append(loginForm);

    const params = getSearchParams(window.location.href);
    if (params.emailtoken) {
      activate(params.emailtoken, loginForm);
    }
  }
});

// Check for a token for email verification.
window.addEventListener('load', async (e) => {});
