import './login.scss';

import { Navbar } from '../shared/components/Navbar';
import AuthView from './AuthView';
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

    // Determine if verifying email or resetting password.
    const params = getSearchParams(window.location.href);
    const authView = new AuthView();
    authView.render(params.resettoken);
    if (params.emailtoken) {
      activateAccount(params.emailtoken);
    }
  }
});

async function activateAccount(emailtToken) {
  const success = await AuthState.activate(emailtToken);
  const alertMsg = success ? 'Account was verified' : 'Invalid Token';
  gAlert.update(success, alertMsg);
  const main = document.querySelector('.main');
  main.insertBefore(gAlert.get(), main.firstElementChild);
}
