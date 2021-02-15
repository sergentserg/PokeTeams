import './login.scss';

import { Navbar } from '../shared/components/Navbar';
import { LoginForm } from './LoginForm';
import { ResetForm } from './ResetForm';
import { Alert } from 'src/shared/components/Alert';

import { getSearchParams } from '../shared/util/getSearchParams';
import { authenticate, activate } from '../shared/util/auth';

authenticate().then((isLoggedIn) => {
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
  activate(emailtToken).then((success) => {
    const alertMsg = success ? 'Account was verified' : 'Invalid Token';
    const alertDiv = Alert(success, alertMsg);
    formContainer.insertBefore(alertDiv, formContainer.firstElementChild);
  });
}
