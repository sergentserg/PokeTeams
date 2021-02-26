import PokedexItem from './PokedexItem';
import { pokedexState } from '../PokedexState';

export default class PokedexItems {
  constructor() {
    this.items = document.createElement('div');
    this.items.setAttribute('id', 'pokeSearchResults');
    this.items.setAttribute('class', 'my-5');
  }

  get() {
    return this.items;
  }

  update() {
    // Clear this.items.
    while (this.items.firstElementChild) this.items.firstElementChild.remove();

    const data = pokedexState.getPage();

    // Populate with new data.
    data.forEach((pokemon) => {
      this.items.append(PokedexItem(pokemon));
    });
  }
}
