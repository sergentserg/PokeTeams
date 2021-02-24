import InputWithSuggest from 'src/shared/components/InputWithSuggest';
import { pokedexState } from '../pokedex/PokedexState';
import { INPUT_DELAY } from 'src/shared/util/constants';

export default class MemberSearch {
  constructor() {
    this.searchTimer = 0;

    this.form = document.createElement('form');
    this.form.classList.add('form-inline');
    this.form.append(InputWithSuggest());

    const searchInput = this.form.querySelector('input');
    searchInput.setAttribute('placeholder', 'Add members...');
    searchInput.setAttribute('data-dex-id', '');
    searchInput.addEventListener('keyup', this.filterPokemons.bind(this));

    this.ul = this.form.querySelector('ul');
  }

  getComponent() {
    return this.form;
  }

  update() {
    this.form.reset();
  }

  filterPokemons(e) {
    const pattern = e.target.value.trim().toLowerCase();
    if (pattern === '') {
      this.ul.classList.add('d-none');
    } else {
      clearTimeout(this.searchTimer);
      this.searchTimer = setTimeout(
        function () {
          const matches = pokedexState
            .getAllPokemon()
            .filter((pokemon) => pokemon.name.toLowerCase().includes(pattern));
          this.showSuggestions(matches);
        }.bind(this),
        INPUT_DELAY
      );
    }
  }

  showSuggestions(matches) {
    while (this.ul.firstElementChild) this.ul.firstElementChild.remove();
    let content = '';
    matches.forEach((pokemon) => {
      content += `
        <li class="px-4 py-2" data-dexID="${pokemon.dexID}">
          ${pokemon.name}
        </li>
      `;
    });
    this.ul.innerHTML = content;
    this.ul.classList.remove('d-none');
  }
}
