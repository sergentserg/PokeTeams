import SearchSuggest from '../../shared/components/SearchSuggest';
import { pokedexState } from '../pokedex/PokedexState';

export default class MemberSearch extends SearchSuggest {
  constructor() {
    super();
    this.form = document.createElement('form');
    this.form.classList.add('form-inline');
    this.form.append(this.group);

    this.search.setAttribute('placeholder', 'Add members...');
    this.search.setAttribute('data-dex-id', '');
  }

  get() {
    return this.form;
  }

  update() {
    this.form.reset();
  }

  getMatches(pattern) {
    const matches = pokedexState
      .getAllPokemon()
      .filter((pokemon) => pokemon.name.toLowerCase().includes(pattern));
    return matches;
  }

  suggestionLi(li, data) {
    li.setAttribute('data-dexID', `${data.dexID}`);
    li.textContent = `${data.name}`;
  }
}
