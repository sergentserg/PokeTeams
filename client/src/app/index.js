import './index.scss';
import { Navbar } from '../shared/components/Navbar';
import { authenticate } from '../shared/util/auth';
import { PokedexView } from './pokedex/PokedexView.js';
import { PokedexState } from './pokedex/PokedexState';

export const POKE_API_URL = 'https://pokeapi.co/api/v2';

authenticate().then(async (isLoggedIn) => {
  if (!isLoggedIn) {
    window.location = 'auth.html';
  } else {
    document.body.insertBefore(Navbar(isLoggedIn), document.body.firstChild);

    // Load user profile (name and image).

    // Determine what page to reload on refresh (local storage?)
    const currentPage = sessionStorage.getItem('currentPage');
    // document.querySelector(`${currentPage}Link`).classList.add('bg-dark');
    let appView;
    if (currentPage === 'profile') {
      console.log('Profile view');
    } else if (currentPage === 'moves') {
      console.log('Moves view');
    } else if (currentPage == 'teams') {
      console.log('Teams view');
    } else {
      const pokedexState = new PokedexState();
      await pokedexState.init();
      appView = new PokedexView(pokedexState);
    }
    const content = appView.render();
    content.classList = 'main';

    const appWrap = document.querySelector('#appWrap');
    appWrap.append(content);
  }
});
