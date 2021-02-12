import './index.scss';

import { Navbar } from '../shared/components/Navbar';
// import { authenticate } from '../shared/util/auth';
const { authenticate } = require('../shared/util/auth');

// Authenticate when this page is loaded.
authenticate().then((isLoggedIn) => {
  if (isLoggedIn) {
    window.replace('profile.html');
  } else {
    const navbar = Navbar(isLoggedIn);
    document.body.insertBefore(navbar, document.body.firstChild);
    navbar.querySelector('.fa-home').closest('a').classList.add('active');
  }
});
