import { pokedexState } from '../PokedexState';

export default class PokedexEntryNav {
  constructor() {
    this.nav = document.createElement('nav');
    this.nav.classList = 'mt-4';
    this.nav.setAttribute('aria-label', 'Pokemon Pokedex entries');

    this.pagination = document.createElement('ul');
    this.pagination.classList = 'pagination';
    this.nav.append(this.pagination);
  }

  get() {
    return this.nav;
  }

  getLinks() {
    return this.pagination;
  }

  update() {
    const { previous, next } = pokedexState.getPokemon();
    let navContent = '';
    if (previous !== null) {
      navContent += `
        <li class="page-item mr-auto">
          <a href="#" class="page-link" data-dexID="${previous}">&#8592; No. ${previous}</a>
        </li>
      `;
    }
    if (next !== null) {
      navContent += `
        <li class="page-item ml-auto">
          <a href="#" class="page-link" data-dexID="${next}">No. ${next} &#8594;</a>
        </li>
      `;
    }
    this.pagination.innerHTML = navContent;
  }
}
