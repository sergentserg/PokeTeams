import DexSearch from './DexSearch';
import SearchFilter from './SearchFilter';
import PokedexItems from './PokedexItems';
import Pagination from './Pagination';
import PokedexEntry from './PokedexEntry';
import PokedexEntryNav from './PokedexEntryNav';
import { pokedexState } from './PokedexState';

import { PAGINATION_LIMIT } from 'src/shared/util/constants';

export class PokedexView {
  constructor(main) {
    this.main = main;
    this.main.id = 'pokedex';
    this.searchFilter = new SearchFilter();
    // Add event listeners.
    this.searchFilter
      .getComponent()
      .addEventListener('click', this.clearFilter.bind(this));

    this.pokedexItems = new PokedexItems();
    this.pokedexItems
      .getComponent()
      .addEventListener('click', this.viewPokemonDetails.bind(this));

    this.pagination = new Pagination();
    this.pagination
      .getComponent()
      .addEventListener('click', this.flipPage.bind(this));

    this.pokedexEntry = new PokedexEntry();

    // Back-to-Pokedex button.
    this.backBtn = document.createElement('button');
    this.backBtn.setAttribute('class', 'btn btn-secondary text-white mb-4');
    this.backBtn.innerHTML =
      '<i class="fas fa-long-arrow-alt-left"></i> Search';
    this.backBtn.addEventListener('click', this.returnToDexSearch.bind(this));

    this.pokedexEntryNav = new PokedexEntryNav();

    // Navigation for fetching other Pokemon.
    this.pokedexEntryNav
      .getComponent()
      .querySelector('.pagination')
      .addEventListener('click', this.updateCurrentPokemon.bind(this));
  }

  render() {
    // Clear view.
    while (this.main.firstElementChild) {
      this.main.firstElementChild.remove();
    }

    // Header.
    const title = document.createElement('h2');
    title.textContent = 'Pokédex';
    this.main.append(title);

    // Search Input.
    const searchComponent = DexSearch();
    searchComponent.addEventListener('submit', this.searchPokedex.bind(this));
    this.main.append(searchComponent);

    // Search filter.
    this.main.append(this.searchFilter.getComponent());

    // Pokedex Items (entries).
    this.main.append(this.pokedexItems.getComponent());

    // Pagination.
    this.main.append(this.pagination.getComponent());

    // Default Pokedex view: all Pokemon.
    const data = pokedexState.getPage();
    this.pokedexItems.update(data);
    this.pagination.update(pokedexState.getTotalPages());
  }

  searchPokedex(e) {
    const searchInput = e.target.elements['pokeSearchInput'];
    const searchQuery = searchInput.value.trim().toLowerCase();
    if (searchQuery !== '') {
      // Don't reload the page.
      e.preventDefault();

      pokedexState.filterPokemons(searchQuery);
      this.searchFilter.update(searchQuery);

      this.pokedexItems.update(pokedexState.getPage());
      this.pagination.update(pokedexState.getTotalPages());
    }
  }

  clearFilter(e) {
    e.target.closest('button').classList.add('d-none');
    pokedexState.clearFilter();
    this.render();
  }

  flipPage(e) {
    const li = e.target.closest('.page-item');
    if (
      li &&
      (li.classList.contains('active') || li.classList.contains('disabled'))
    ) {
      return;
    }
    const buttonClickText = e.target.innerHTML;
    const totalPages = pokedexState.getTotalPages();

    // Determine updated values for the active page number, and the new first in the pagination.
    let newFirst, newActive;
    if (buttonClickText == 'First') newActive = 1;
    else if (buttonClickText == 'Last') newActive = totalPages;
    else if (buttonClickText == '&gt;&gt;')
      newActive = pokedexState.getPageNumber() + 1;
    else if (buttonClickText == '&lt;&lt;')
      newActive = pokedexState.getPageNumber() - 1;
    else newActive = parseInt(buttonClickText);
    pokedexState.setPageNumber(newActive);
    newFirst =
      PAGINATION_LIMIT * Math.floor((newActive - 1) / PAGINATION_LIMIT) + 1;

    this.pokedexItems.update(pokedexState.getPage());
    this.pagination.update(totalPages, newFirst, newActive);
  }

  async viewPokemonDetails(e) {
    const viewDetailsBtn = e.target.closest('.poke-details-btn');
    if (viewDetailsBtn) {
      // Fetch the Pokemon details.
      const dexID = viewDetailsBtn.getAttribute('data-poke-dexid');
      await pokedexState.setPokemon(dexID);

      // Clear the view.
      while (this.main.firstElementChild) {
        this.main.firstElementChild.remove();
      }

      this.main.append(this.backBtn);

      // Render the Pokedex entry from fetched details.
      this.pokedexEntry.update();
      this.main.append(this.pokedexEntry.getComponent());
      this.pokedexEntryNav.update();
      this.main.append(this.pokedexEntryNav.getComponent());
    } else {
      console.log("Didn't click details btn");
    }
  }

  returnToDexSearch(e) {
    this.render();
  }

  async updateCurrentPokemon(e) {
    const dexID = e.target.getAttribute('data-dexID');
    if (dexID) {
      await pokedexState.setPokemon(dexID);
      this.pokedexEntry.update();
      this.pokedexEntryNav.update();
    }
  }
}
