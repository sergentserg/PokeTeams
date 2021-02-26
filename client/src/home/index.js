import './index.scss';
import '../shared/assets/favicon.ico';

import { Navbar } from '../shared/components/Navbar';
import { authState } from '../auth/AuthState';

// Authenticate when this page is loaded.
authState.authenticate().then((isLoggedIn) => {
  if (isLoggedIn) {
    window.location.replace('app.html');
  } else {
    const navbar = Navbar(isLoggedIn);
    document.body.insertBefore(navbar, document.body.firstChild);
    navbar.querySelector('.fa-home').closest('a').classList.add('active');
  }
});
