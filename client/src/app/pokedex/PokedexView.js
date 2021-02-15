// Header (Pokedex)
// Search form component.
// FilterClear component.
// Results component
// Pokemon component
// Navigation component.
import { DexSearch } from './DexSearch';

export function PokedexView() {
  const view = document.createElement('div');
  view.id = 'pokedex';
  // Header.
  const title = document.createElement('h2');
  title.innerText = 'Pokédex';
  view.append(title);

  // Search form.
  view.append(DexSearch());

  return view;
}

async function searchPokemon(e) {
  const searchInput = e.target.elements['pokeSearchInput'];
  const searchQuery = searchInput.value.trim().toLowerCase();
  if (searchQuery !== '') {
    // Don't reload.
    e.preventDefault();
    // Get all Pokemon.
  }

  // const { searchInput } = UICtrl.getSelectors();
  // const searchQuery = document.querySelector(searchInput).value.toLowerCase();

  // if (searchQuery !== '') {
  //   // Keep the page from reloading.
  //   event.preventDefault();
  //   // Perform the search and display results.
  //   await PokedexCtrl.filterPokemons(searchQuery);
  //   populateResults();
  //   UICtrl.createFilterBtn(searchQuery);
  // }
}
