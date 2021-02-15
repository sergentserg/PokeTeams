import './index.scss';
import { Navbar } from '../shared/components/Navbar';
import { authenticate } from '../shared/util/auth';
import { PokedexView } from './pokedex/PokedexView.js';

authenticate().then((isLoggedIn) => {
  if (!isLoggedIn) {
    window.location = 'login.html';
  } else {
    // Navbar element at the top.
    document.body.insertBefore(Navbar(isLoggedIn), document.body.firstChild);

    // Load user profile (name and image).

    const appWrap = document.querySelector('#appWrap');

    // Determine what page to reload on refresh (local storage?)
    const currentPage = localStorage.getItem('currentPage');
    let appView;
    if (currentPage === 'profile') {
      console.log('Profile view');
    } else if (currentPage === 'moves') {
      console.log('Moves view');
    } else if (currentPage == 'teams') {
      console.log('Teams view');
    } else {
      console.log('Pokedex view (default)');
      appView = PokedexView();
    }
    appView.classList = 'main';

    // Load Pokedex view by default.
    appWrap.appendChild(appView);
  }
});
