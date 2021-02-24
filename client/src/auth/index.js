import './login.scss';

import { Navbar } from '../shared/components/Navbar';
import { LoginForm } from './LoginForm';
import { ResetForm } from './ResetForm';
import { gAlert } from '../shared/components/Alert';

import { getSearchParams } from '../shared/util/getSearchParams';
import { authState, AuthState } from './AuthState';

authState.authenticate().then((isLoggedIn) => {
  if (isLoggedIn) {
    window.location.replace('app.html');
  } else {
    // Display Nav.
    const navbar = Navbar(isLoggedIn);
    navbar
      .querySelector('.fa-sign-in-alt')
      .closest('a')
      .classList.add('active');
    document.body.insertBefore(navbar, document.body.firstChild);

    const formContainer = document.querySelector('.auth-container');
    const params = getSearchParams(window.location.href);

    if (params.resettoken) {
      ResetForm(formContainer, params.resettoken);
    } else {
      LoginForm(formContainer);
      if (params.emailtoken) {
        activateAccount(params.emailtoken, formContainer);
      }
    }
  }
});

function activateAccount(emailtToken, formContainer) {
  AuthState.activate(emailtToken).then((success) => {
    const alertMsg = success ? 'Account was verified' : 'Invalid Token';
    gAlert.update(success, alertMsg);
    formContainer.insertBefore(gAlert.get(), formContainer.firstElementChild);
  });
}
