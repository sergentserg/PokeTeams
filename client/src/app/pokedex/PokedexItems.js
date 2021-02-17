import PokedexItem from './PokedexItem';

export default (function PokedexItems() {
  const items = document.createElement('div');
  items.setAttribute('id', 'pokeSearchResults');
  items.setAttribute('class', 'my-5');

  return {
    component: items,
    update: function (data) {
      // Clear items.
      while (items.firstElementChild) items.firstElementChild.remove();

      // Populate with new data.
      data.forEach((pokemon) => {
        items.append(PokedexItem(pokemon));
      });
    },
  };
})();
