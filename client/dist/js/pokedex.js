const PokedexCtrl = (function () {
  let pokemons;
  let currentPage;
  let totalPages;

  async function getPokedex() {
    const response = await fetch(POKEDEX_URL);
    const data = await response.json();
    pokemons = data.results;
  }

  return {
    init: async function () {
      await getPokedex();
      currentPage = 1;
      totalPages = Math.ceil(MAX_DEX_ID / POKE_PER_PAGE);
    },
    setPageNumber: function (pageNum) {
      currentPage = pageNum;
    },
    getPageNumber: function () {
      return currentPage;
    },
    getTotalPages: function () {
      return totalPages;
    },
    getPage: function () {
      const startIndex = (currentPage - 1) * POKE_PER_PAGE;
      const pokemonPage = pokemons.slice(
        startIndex,
        startIndex + POKE_PER_PAGE
      );

      // Set Pokedex ID and capitalized name.
      pokemonPage.forEach((pokemon) => {
        const id = parseInt(pokemon.url.match(/\/(\d+)\//)[1]);
        pokemon.dexID = dexIDFromID(id);
        pokemon.name = capitalize(pokemon.name);
      });
      return pokemonPage;
    },
    filterPokemons: async function (searchQuery) {
      localStorage.setItem('searchQuery', searchQuery);
      await getPokedex();
      pokemons = pokemons.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(searchQuery)
      );
      totalPages = Math.ceil(pokemons.length / POKE_PER_PAGE);
      currentPage = 1;
    },
    clearFilter: async function () {
      localStorage.removeItem('searchQuery');
      await getPokedex();
      totalPages = Math.ceil(MAX_DEX_ID / POKE_PER_PAGE);
      currentPage = 1;
    },
  };
})();

const UICtrl = (function () {
  const UISelectors = {
    searchBtn: '#pokemonSearchBtn',
    searchInput: '#pokemonSearchInput',
    resultsContainer: '#pokeSearchResults',
    pagination: '.pagination',
    filterBtn: '#filterBtn',
    searchForm: '.search-form',
  };

  return {
    createPagination: function (totalPages, newFirst, newActive) {
      const pagination = document.querySelector('.pagination');

      if (totalPages <= 1) {
        pagination.parentElement.classList.add('d-none');
      } else {
        const firstLi = pagination.firstElementChild;
        const lastLi = pagination.lastElementChild;
        const prevLi = firstLi.nextElementSibling;
        const nextLi = lastLi.previousElementSibling;

        // Reset the pagination element.
        while (prevLi.nextElementSibling !== nextLi) {
          prevLi.nextElementSibling.remove();
        }

        // Create navigation links.
        const maxPageLinks = Math.min(
          totalPages - newFirst + 1,
          PAGINATION_LIMIT
        );

        for (let i = 0; i < maxPageLinks; i++) {
          const li = document.createElement('li');
          li.classList.add('page-item');
          li.setAttribute('data-page-num', `${newFirst + i}`);
          li.innerHTML = `
            <button href="#" class="page-link">
              ${newFirst + i}
            </button>
          `;
          pagination.insertBefore(li, nextLi);
        }

        // Disallow clicks on active li.
        const activeLi = document.querySelector(
          `[data-page-num="${newActive}"]`
        );
        activeLi.classList.add('active');

        // Disable edge-case links.
        if (newActive > 1 && newActive < totalPages) {
          [firstLi, prevLi, nextLi, lastLi].forEach((li) =>
            li.classList.remove('disabled')
          );
        } else if (newActive === 1) {
          [firstLi, prevLi].forEach((li) => li.classList.add('disabled'));
          [nextLi, lastLi].forEach((li) => li.classList.remove('disabled'));
        } else if (newActive === totalPages) {
          [firstLi, prevLi].forEach((li) => li.classList.remove('disabled'));
          [nextLi, lastLi].forEach((li) => li.classList.add('disabled'));
        }

        // Display ellipses.
        if (totalPages > PAGINATION_LIMIT) {
          // Create ellipses element.
          const li = document.createElement('li');
          li.classList.add('page-item', 'disabled');
          li.setAttribute('data-page-num', 'ellipsis');
          li.innerHTML = `<button href="#" class="page-link">...</button>`;

          // Ellipsis on the left.
          if (totalPages - newFirst < PAGINATION_LIMIT) {
            const newFirstPageLi = prevLi.nextElementSibling;
            pagination.insertBefore(li, newFirstPageLi);
          } else {
            // Ellipsis on right.
            pagination.insertBefore(li, nextLi);
          }
        }

        // Display it in the UI.
        pagination.parentElement.classList.remove('d-none');
      }
    },
    createFilterBtn: function (searchQuery) {
      const filterBtn = document.querySelector(UISelectors.filterBtn);
      filterBtn.querySelector('span').innerText = searchQuery;
      filterBtn.classList.remove('d-none');
    },
    removeFilterBtn: function () {
      document.querySelector(UISelectors.searchForm).reset();
      document.querySelector(UISelectors.filterBtn).classList.add('d-none');
    },
    populateResults: function (pokedexPage) {
      const resultsContainer = document.querySelector(
        UISelectors.resultsContainer
      );

      pokedexPage.forEach((pokemon) => {
        const pokemonCard = document.createElement('div');
        pokemonCard.classList.add('pokemon-card', 'border');
        pokemonCard.innerHTML = `
      <select class="form-control" name="teamSelect">
        <option selected disabled hidden>Choose a team</option>
        <option value="teamA">Team A</option>
        <option value="teamB">Team B</option>
        <option value="teamC">Team C</option>
      </select>
      <div
        class="poke-img-area py-4"
      >
        <img
          src="https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${pokemon.dexID}.png" alt="${pokemon.name}"
        />
        <div class="poke-card-buttons">
          <button class="btn poke-add-btn">
            <i class="fas fa-plus-circle"></i>
          </button>
          <button class="btn poke-fav-btn">
            <i class="far fa-heart"></i>
          </button>
        </div>
      </div>

      <button class="btn btn-block btn-dark poke-details-btn" data-poke-dexid="${pokemon.dexID}">
        #${pokemon.dexID} ${pokemon.name}
        <i class="fas fa-eye"></i>
      </button>`;

        resultsContainer.appendChild(pokemonCard);
      });
    },
    clearResults: function () {
      const pokeSearchResults = document.querySelector(
        UISelectors.resultsContainer
      );
      while (pokeSearchResults.firstElementChild) {
        pokeSearchResults.firstElementChild.remove();
      }
    },
    getSelectors: function () {
      return UISelectors;
    },
  };
})();

const AppCtrl = (function (UICtrl, PokedexCtrl) {
  // Helper function.
  function populateResults(newFirst = 1, newActive = 1) {
    UICtrl.clearResults();
    const pokedexPage = PokedexCtrl.getPage();
    UICtrl.populateResults(pokedexPage);
    totalPages = PokedexCtrl.getTotalPages();
    UICtrl.createPagination(totalPages, newFirst, newActive);
  }

  async function searchPokemon(event) {
    const { searchInput } = UICtrl.getSelectors();
    const searchQuery = document.querySelector(searchInput).value.toLowerCase();

    if (searchQuery !== '') {
      // Keep the page from reloading.
      event.preventDefault();
      // Perform the search and display results.
      await PokedexCtrl.filterPokemons(searchQuery);
      populateResults();
      UICtrl.createFilterBtn(searchQuery);
    }
  }

  async function removeFilter() {
    await PokedexCtrl.clearFilter();
    UICtrl.removeFilterBtn();
    populateResults();
  }

  function updatePagination(event) {
    const li = event.target.closest('.page-item');
    if (
      li &&
      (li.classList.contains('active') || li.classList.contains('disabled'))
    ) {
      return;
    }
    const buttonClickText = event.target.innerHTML;
    const totalPages = PokedexCtrl.getTotalPages();

    // Determine updated values for the active page number, and the new first in the pagination.
    let newFirst, newActive;
    if (buttonClickText == 'First') newActive = 1;
    else if (buttonClickText == 'Last') newActive = totalPages;
    else if (buttonClickText == '&gt;&gt;')
      newActive = PokedexCtrl.getPageNumber() + 1;
    else if (buttonClickText == '&lt;&lt;')
      newActive = PokedexCtrl.getPageNumber() - 1;
    else newActive = parseInt(buttonClickText);
    PokedexCtrl.setPageNumber(newActive);
    newFirst =
      PAGINATION_LIMIT * Math.floor((newActive - 1) / PAGINATION_LIMIT) + 1;
    populateResults(newFirst, newActive);
  }

  function loadPokePage(event) {
    // Save the DEX # for clicked Pokemon and redirect.
    const pokemonBtn = event.target.closest('.poke-details-btn');
    console.log(pokemonBtn.getAttribute('data-poke-dexid'));
    sessionStorage.setItem(
      'currentDexID',
      pokemonBtn.getAttribute('data-poke-dexid')
    );
    window.location.href = 'pokemon.html';
  }

  function addToFavorites() {}

  function addToTeam() {}

  function loadAllEventListeners() {
    const {
      searchBtn,
      pagination,
      resultsContainer,
      filterBtn,
    } = UICtrl.getSelectors();

    document.querySelector(searchBtn).addEventListener('click', searchPokemon);

    document
      .querySelector(pagination)
      .addEventListener('click', updatePagination);

    document
      .querySelector(resultsContainer)
      .addEventListener('click', loadPokePage);

    document.querySelector(filterBtn).addEventListener('click', removeFilter);
  }

  return {
    init: async function () {
      authenticate();
      await PokedexCtrl.init();
      populateResults();
      loadAllEventListeners();
    },
  };
})(UICtrl, PokedexCtrl);

AppCtrl.init();
