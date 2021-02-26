import DexSearch from './search/DexSearch';
import SearchFilter from './search/SearchFilter';
import PokedexItems from './search/PokedexItems';
import Pagination from './search/Pagination';
import PokedexEntry from './entry/PokedexEntry';
import PokedexEntryNav from './entry/PokedexEntryNav';
import { pokedexState } from './PokedexState';

export class PokedexView {
  constructor(main) {
    this.main = main;
    this.main.id = 'pokedex';
    this.searchFilter = new SearchFilter();
    this.dexSearch = new DexSearch();

    this.pokedexItems = new PokedexItems();
    this.pagination = new Pagination();

    // Back-to-Pokedex button.
    this.backBtn = document.createElement('button');
    this.backBtn.setAttribute('class', 'btn btn-secondary text-white mb-4');
    this.backBtn.innerHTML =
      '<i class="fas fa-long-arrow-alt-left"></i> Search';
    this.pokedexEntry = new PokedexEntry();
    this.pokedexEntryNav = new PokedexEntryNav();

    // Add event listeners.
    this.searchFilter
      .get()
      .addEventListener('click', this.clearFilter.bind(this));
    this.dexSearch
      .get()
      .addEventListener('submit', this.searchPokedex.bind(this));
    this.pokedexItems
      .get()
      .addEventListener('click', this.viewPokemonDetails.bind(this));

    this.pagination
      .getLinks()
      .addEventListener('click', this.flipPage.bind(this));

    this.backBtn.addEventListener('click', this.returnToDexSearch.bind(this));

    // Navigation for fetching other Pokemon.
    this.pokedexEntryNav
      .getLinks()
      .addEventListener('click', this.updateCurrentPokemon.bind(this));
  }

  render() {
    // Header.
    const title = document.createElement('h2');
    title.textContent = 'Pokédex';
    this.main.append(title);

    // Search Input.
    this.main.append(this.dexSearch.get());

    // Search filter.
    this.main.append(this.searchFilter.get());

    // Pokedex Items (entries).
    pokedexState.clearFilter();
    this.pokedexItems.update();
    this.main.append(this.pokedexItems.get());

    // Pagination.
    this.pagination.update();
    this.main.append(this.pagination.get());
  }

  searchPokedex(e) {
    const searchInput = e.target.elements['pokeSearchInput'];
    const searchQuery = searchInput.value.trim().toLowerCase();
    if (searchQuery !== '') {
      // Don't reload the page.
      e.preventDefault();

      pokedexState.filter(searchQuery);
      this.searchFilter.update(searchQuery);

      this.pokedexItems.update();
      this.pagination.update();
    }
  }

  clearFilter(e) {
    const button = e.target.closest('button');
    if (button) {
      button.classList.add('d-none');
      pokedexState.clearFilter();
      this.pokedexItems.update();
      this.pagination.update();
    }
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
    let newActive;
    if (buttonClickText == 'First') newActive = 1;
    else if (buttonClickText == 'Last') newActive = totalPages;
    else if (buttonClickText == '&gt;&gt;')
      newActive = pokedexState.getPageNumber() + 1;
    else if (buttonClickText == '&lt;&lt;')
      newActive = pokedexState.getPageNumber() - 1;
    else newActive = parseInt(buttonClickText);
    pokedexState.setPageNumber(newActive);

    this.pokedexItems.update();
    this.pagination.update();
  }

  async viewPokemonDetails(e) {
    const viewDetailsBtn = e.target.closest('.poke-details-btn');
    if (viewDetailsBtn) {
      // Fetch the Pokemon details.
      const dexID = viewDetailsBtn.getAttribute('data-dexID');
      await pokedexState.setPokemon(dexID);

      // Clear the view.
      while (this.main.firstElementChild) {
        this.main.firstElementChild.remove();
      }

      // Render back button.
      this.main.append(this.backBtn);

      // Render the Pokedex entry from fetched details.
      this.pokedexEntry.update();
      this.main.append(this.pokedexEntry.get());
      this.pokedexEntryNav.update();
      this.main.append(this.pokedexEntryNav.get());
    }
  }

  returnToDexSearch(e) {
    // Clear view.
    while (this.main.firstElementChild) {
      this.main.firstElementChild.remove();
    }
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
