import DexSearch from './DexSearch';
import SearchFilter from './SearchFilter';
import PokedexItems from './PokedexItems';
import Pagination from './Pagination';
import PokedexEntry from './PokedexEntry';
import PokedexEntryNav from './PokedexEntryNav';

export class PokedexView {
  constructor(state) {
    this.state = state;
    this.view = document.querySelector('.main');
    this.view.id = 'pokedex';
  }

  render() {
    // Clear view.
    while (this.view.firstElementChild) this.view.firstElementChild.remove();

    // Show Pokedex entry or Pokedex items.
    const currentPokemon = sessionStorage.getItem('currentPokemon');
    if (!currentPokemon) {
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
      // Back-to-Pokedex button; clear currentPokemon.
      const backBtn = document.createElement('button');
      backBtn.setAttribute('class', 'btn btn-secondary text-white mb-4');
      backBtn.innerHTML = '<i class="fas fa-long-arrow-alt-left"></i> Search';
      backBtn.addEventListener('click', this.returnToDexSearch.bind(this));
      this.view.append(backBtn);

      this.state.getPokemon(currentPokemon).then((data) => {
        PokedexEntry.update(data);
        this.view.append(PokedexEntry.component);
        const pokedexEntryNav = PokedexEntryNav(data.previous, data.next);
        pokedexEntryNav.addEventListener(
          'click',
          this.updateCurrentPokemon.bind(this)
        );
        this.view.append(pokedexEntryNav);
      });
    }
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
    const viewDetailsBtn = e.target.closest('.poke-details-btn');
    if (viewDetailsBtn) {
      const dexID = viewDetailsBtn.getAttribute('data-poke-dexid');
      sessionStorage.setItem('currentPokemon', dexID);
      // console.log(viewDetailsBtn.getAttribute('data-poke-dexid'));
      sessionStorage.setItem('currentPage', 'pokemon');
      this.render();
    } else {
      console.log("Didn't click details btn");
    }
  }

  returnToDexSearch(e) {
    sessionStorage.removeItem('currentPokemon');
    this.render();
  }

  updateCurrentPokemon(e) {
    const dexID = e.target.getAttribute('data-dexID');
    if (dexID) {
      sessionStorage.setItem('currentPokemon', dexID);
      this.render();
    }
  }
}
