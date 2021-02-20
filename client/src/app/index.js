import './index.scss';
import { Navbar } from '../shared/components/Navbar';
import { authenticate, logout } from '../shared/util/auth';
import { PokedexView } from './pokedex/PokedexView.js';
import { PokedexState } from './pokedex/PokedexState';
import MovesState from './moves/MovesState';
import MovesView from './moves/MovesView';

authenticate().then((isLoggedIn) => {
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
    document.querySelector('#logoutLink').addEventListener('click', logout);

    // Load user profile (name and image).

    // Default to Pokedex view.
    let currentPage = sessionStorage.getItem('currentPage');
    if (!currentPage) {
      sessionStorage.setItem('currentPage', 'pokedex');
      currentPage = 'pokedex';
    }
    console.log(currentPage);
    document
      .querySelector(`[data-view="${currentPage}"]`)
      .classList.add('bg-dark');
    loadPage(currentPage);
  }
});

async function loadPage(currentPage) {
  const appView = document.querySelector('.main');
  while (appView.firstElementChild) appView.firstElementChild.remove();

  const pages = {
    pokedex: {
      view: PokedexView,
      state: PokedexState,
    },
    moves: {
      view: MovesView,
      state: MovesState,
    },
  };
  const page = pages[currentPage];
  const state = new page.state();
  await state.init();
  const view = new page.view(state);
  view.render();
}

document.querySelector('.side-nav .nav').addEventListener('click', (e) => {
  const newPageLink = e.target.closest('.nav-item');
  const newPage = newPageLink.getAttribute('data-view');
  const currentPage = sessionStorage.getItem('currentPage');
  if (newPage && currentPage !== newPage) {
    sessionStorage.setItem('currentPage', newPage);
    document
      .querySelector(`[data-view="${currentPage}"]`)
      .classList.remove('bg-dark');
    newPageLink.classList.add('bg-dark');

    loadPage(newPage);
  }
});
