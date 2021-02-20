import PokedexItem from './PokedexItem';

export default class PokedexItems {
  constructor() {
    this.items = document.createElement('div');
    this.items.setAttribute('id', 'pokeSearchResults');
    this.items.setAttribute('class', 'my-5');
  }

  getComponent() {
    return this.items;
  }

  update(data) {
    // Clear this.items.
    while (this.items.firstElementChild) this.items.firstElementChild.remove();

    // Populate with new data.
    data.forEach((pokemon) => {
      this.items.append(PokedexItem(pokemon));
    });
  }
}
