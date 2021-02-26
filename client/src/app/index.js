import './index.scss';
import '../shared/assets/favicon.ico';

import { authState, AuthState } from '../auth/AuthState';
import { pokedexState } from './pokedex/PokedexState';
import { moveState } from './moves/MoveState';
import { teamState } from './teams/TeamState';
import { itemState } from './teams/ItemState';

import { Navbar } from '../shared/components/Navbar';
import ProfileView from './profile/ProfileView';
import { PokedexView } from './pokedex/PokedexView.js';
import MovesView from './moves/MovesView';
import TeamView from './teams/TeamView';

authState.authenticate().then(async (isLoggedIn) => {
  if (!isLoggedIn) {
    window.location = 'auth.html';
  } else {
    // Create a Navbar.
    document.body.insertBefore(Navbar(isLoggedIn), document.body.firstChild);

    // Disable Navbar toggler when logged in.
    document.querySelector('.navbar-toggler').style.display = 'none';

    // Enable side-nav toggler on smaller screens.
    document.querySelector('#sidenavToggler').addEventListener('click', () => {
      document.querySelector('.side-nav').classList.toggle('show-sidenav');
    });

    // Enable logout functionality.
    document
      .querySelector('#logoutLink')
      .addEventListener('click', AuthState.logout);

    // Load user profile (name and image).
    document.querySelector('#profilePhoto').src = authState.getPhotoUrl();

    // Default to Pokedex view.
    let currentPage = sessionStorage.getItem('currentPage');
    if (!currentPage) {
      sessionStorage.setItem('currentPage', 'pokedex');
      currentPage = 'pokedex';
    }
    document
      .querySelector(`[data-view="${currentPage}"]`)
      .classList.add('bg-dark');
    await pokedexState.init();
    await moveState.init();
    await teamState.init();
    await itemState.init();
    loadPage(currentPage);
  }
});

function loadPage(currentPage) {
  const main = document.querySelector('.main');
  while (main.firstElementChild) main.firstElementChild.remove();
  let view;
  if (currentPage === 'profile') {
    view = new ProfileView(main);
  } else if (currentPage === 'pokedex') {
    view = new PokedexView(main);
  } else if (currentPage === 'moves') {
    view = new MovesView(main);
  } else if (currentPage === 'teams') {
    view = new TeamView(main);
  }
  view.render();
}

document.querySelector('.side-nav .nav').addEventListener('click', (e) => {
  const newPageLink = e.target.closest('.nav-item');
  const newPage = newPageLink.getAttribute('data-view');
  const currentPage = sessionStorage.getItem('currentPage');
  // Only access new page if still authenticated.
  if (newPage && currentPage !== newPage) {
    authState.authenticate().then((isLoggedIn) => {
      if (!isLoggedIn) {
        window.location = 'auth.html';
      } else {
        sessionStorage.setItem('currentPage', newPage);
        document
          .querySelector(`[data-view="${currentPage}"]`)
          .classList.remove('bg-dark');
        newPageLink.classList.add('bg-dark');
        loadPage(newPage);
      }
    });
  }
});
