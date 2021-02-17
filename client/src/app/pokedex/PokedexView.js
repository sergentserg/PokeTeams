import DexSearch from './DexSearch';
import SearchFilter from './SearchFilter';
import PokedexItems from './PokedexItems';
import Pagination from './Pagination';
import PokedexEntry from './PokedexEntry';

export class PokedexView {
  constructor(state) {
    this.state = state;
    this.view = document.createElement('div');
  }

  render() {
    // Clear view.
    while (this.view.firstElementChild) this.view.firstElementChild.remove();

    // Show Pokedex entry or Pokedex items.
    const currentPokemon = sessionStoraget.getItem('currentPokemon');
    if (!currentPokemon) {
      this.view.id = 'pokedex';
      // Header.
      const title = document.createElement('h2');
      title.innerText = 'Pokédex';
      this.view.append(title);

      // Search Input.
      const searchComponent = DexSearch();
      searchComponent.addEventListener('submit', this.searchPokedex.bind(this));
      this.view.append(searchComponent);

      // Search filter.
      const searchFilter = SearchFilter.component;
      searchFilter.addEventListener('click', this.clearFilter.bind(this));
      this.view.append(searchFilter);

      // PokedexItems.
      const itemsComponent = PokedexItems.component;
      itemsComponent.addEventListener(
        'click',
        this.viewPokemonDetails.bind(this)
      );
      this.view.append(itemsComponent);

      // Pagination.
      const paginationComponent = Pagination.component;
      paginationComponent.addEventListener('click', this.flipPage.bind(this));
      this.view.append(paginationComponent);

      // Default Pokedex view: all Pokemon.
      const data = this.state.getPage();
      PokedexItems.update(data);
      Pagination.update(this.state.getTotalPages());
    } else {
      this.view.id = 'pokemon';
      // <a
      //   href="pokedex.html"
      //   class="btn btn-secondary text-white results-btn mb-4"
      // >
      //   <i class="fas fa-long-arrow-alt-left"></i> Search
      // </a>;
    }

    return this.view;
  }

  searchPokedex(e) {
    const searchInput = e.target.elements['pokeSearchInput'];
    const searchQuery = searchInput.value.trim().toLowerCase();
    if (searchQuery !== '') {
      // Don't reload the page.
      e.preventDefault();

      this.state.filterPokemons(searchQuery);
      SearchFilter.update(searchQuery);

      PokedexItems.update(this.state.getPage());
      Pagination.update(this.state.getTotalPages());
    }
  }

  clearFilter(e) {
    e.target.closest('button').classList.add('d-none');
    this.state.clearFilter();
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
    const totalPages = this.state.getTotalPages();

    // Determine updated values for the active page number, and the new first in the pagination.
    let newFirst, newActive;
    if (buttonClickText == 'First') newActive = 1;
    else if (buttonClickText == 'Last') newActive = totalPages;
    else if (buttonClickText == '&gt;&gt;')
      newActive = this.state.getPageNumber() + 1;
    else if (buttonClickText == '&lt;&lt;')
      newActive = this.state.getPageNumber() - 1;
    else newActive = parseInt(buttonClickText);
    this.state.setPageNumber(newActive);
    newFirst =
      Pagination.PAGINATION_LIMIT *
        Math.floor((newActive - 1) / Pagination.PAGINATION_LIMIT) +
      1;

    PokedexItems.update(this.state.getPage());
    Pagination.update(totalPages, newFirst, newActive);
  }

  viewPokemonDetails(e) {
    // Insead of refreshing, clear everything and show the Pokemon page
    // Save the DEX # for clicked Pokemon and redirect.
    const viewDetailsBtn = e.target.closest('.poke-details-btn');
    if (viewDetailsBtn) {
      sessionStorage.setItem(
        'currentDexID',
        viewDetailsBtn.getAttribute('data-poke-dexid')
      );
      sessionStorage.setItem('currentPage', 'pokemon');
      console.log(viewDetailsBtn.getAttribute('data-poke-dexid'));
      location.reload();
    } else {
      console.log("Didn't click details btn");
    }
  }
}
