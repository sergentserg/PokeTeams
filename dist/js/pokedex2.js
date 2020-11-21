const PokedexCtrl = (function () {
  let results;
  return {
    getResults: function () {
      return results;
    },
    filterResults: function (searchQuery) {
      const allPokemon = JSON.parse(localStorage.getItem('allPokemon'));
      if (!searchQuery) {
        localStorage.removeItem('searchQuery');
        results = allPokemon.results;
      } else {
        localStorage.setItem('searchQuery', searchQuery);
        results = allPokemon.results.filter((pokemon) =>
          pokemon.name.toLowerCase().includes(searchQuery)
        );
      }
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
    createPagination: function (totalPages, newFirst = 1, newActive = 1) {
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
        const maxPageLinks = Math.min(totalPages, PAGINATION_LIMIT);

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
        activeLi.style.pointerEvents = 'none';

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
    populateResults: function (results) {
      const resultsContainer = document.querySelector(
        UISelectors.resultsContainer
      );

      results.forEach((pokemon) => {
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
        class="poke-img d-flex justify-content-center align-content-center py-4"
      >
        <img
          src="https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${
            pokemon.dexID
          }.png" alt="${pokemon.name}"
        />
        <div class="poke-card-buttons d-flex justify-content-between">
          <button class="btn poke-add-btn">
            <i class="fas fa-plus-circle"></i>
          </button>
          <button class="btn poke-fav-btn">
            <i class="far fa-heart"></i>
          </button>
        </div>
      </div>

      <button class="btn btn-block btn-dark poke-details-btn" data-poke-id="${parseInt(
        pokemon.dexID
      )}">
        #${pokemon.dexID} ${pokemon.name}
        <i class="fas fa-eye"></i>
      </button>`;

        resultsContainer.appendChild(pokemonCard);
      });

      // pokemonCard
      //   .querySelector('.poke-details-btn')
      //   .addEventListener('click', () => {
      //     // Passing in json index of pokemon
      //     getPokemon(parseInt(pokemon.dexID) - 1);
      //   });
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
  function populateResults(newFirst = 1, newActive = 1) {
    UICtrl.clearResults();

    // // Display only the first 20.
    const results = PokedexCtrl.getResults();
    const startIndex = POKE_PER_PAGE * (newActive - 1);
    const endIndex = Math.min(results.length, startIndex + POKE_PER_PAGE);
    UICtrl.populateResults(results.slice(startIndex, endIndex));

    // Recreate pagination.
    const totalPages = Math.ceil(results.length / POKE_PER_PAGE);
    UICtrl.createPagination(totalPages, newFirst, newActive);

    const searchQuery = localStorage.getItem('searchQuery');
    if (searchQuery) {
      UICtrl.createFilterBtn(searchQuery);
    }
  }

  function searchPokemon(event) {
    const { searchInput } = UICtrl.getSelectors();
    const searchQuery = document.querySelector(searchInput).value.toLowerCase();

    if (searchQuery !== '') {
      // Keep the page from reloading.
      event.preventDefault();

      // Perform the search and display results.
      PokedexCtrl.filterResults(searchQuery);
      populateResults();
    }
  }

  function removeFilter() {
    PokedexCtrl.filterResults();
    UICtrl.removeFilterBtn();
    populateResults();
  }

  function updatePagination(event) {
    const buttonClickText = event.target.innerHTML;

    const results = PokedexCtrl.getResults();
    const totalPages = Math.ceil(results.length / POKE_PER_PAGE);

    // Determine updated values for the active page number, and the new first in the pagination.
    let newFirst, newActive;
    if (buttonClickText == 'First') {
      (newFirst = 1), (newActive = 1);
    } else if (buttonClickText == 'Last') {
      // More than 5 pages? Start at offset, otherwise Start at 1
      newFirst =
        totalPages > PAGINATION_LIMIT ? totalPages - (PAGINATION_LIMIT - 1) : 1;
      newActive = totalPages;
    } else if (buttonClickText === '&gt;&gt;') {
      // (Next >>)
      const currentPageNum = parseInt(
        document.querySelector('.pagination .active button').innerHTML
      );
      if (totalPages > PAGINATION_LIMIT) {
        if (totalPages - currentPageNum < PAGINATION_LIMIT) {
          newFirst = totalPages - (PAGINATION_LIMIT - 1);
        } else {
          newFirst = currentPageNum + 1;
        }
      }
      newActive = currentPageNum + 1;
    } else if (buttonClickText === '&lt;&lt;') {
      const currentPageNum = parseInt(
        document.querySelector('.pagination .active button').innerHTML
      );
      if (totalPages > PAGINATION_LIMIT) {
        if (totalPages - currentPageNum < PAGINATION_LIMIT - 1) {
          newFirst = totalPages - (PAGINATION_LIMIT - 1);
        } else {
          newFirst = currentPageNum - 1;
        }
      }
      newActive = currentPageNum - 1;
    } else if (!isNaN(buttonClickText)) {
      // Clicked number in pagination.
      newActive = parseInt(buttonClickText);
      if (totalPages > PAGINATION_LIMIT) {
        if (totalPages - newActive < PAGINATION_LIMIT) {
          newFirst = totalPages - (PAGINATION_LIMIT - 1);
        } else {
          newFirst = newActive;
        }
      }
    } else {
      return;
    }
    populateResults(newFirst, newActive);
  }

  function loadPokePage(event) {
    if (event.target.classList.contains('poke-details-btn')) {
      const dexID = +event.target.getAttribute('data-poke-id');
      // in script.js
      getPokemon(dexID - 1);
    }
  }

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
      let allPokemon = localStorage.getItem('allPokemon');
      let searchQuery;
      if (!allPokemon) {
        const res = await fetch(POKE_API_URL);
        allPokemon = await res.json();

        // Update name and set dexID.
        allPokemon.results.forEach((pokemon, index) => {
          pokemon.dexID = ('000' + (index + 1)).substr(-3, 3);
          // in script.js.
          pokemon.name = capitalizeWord(pokemon.name);
        });
        localStorage.setItem('allPokemon', JSON.stringify(allPokemon));
      } else {
        searchQuery = localStorage.getItem('searchQuery');
      }
      PokedexCtrl.filterResults(searchQuery);
      populateResults();

      loadAllEventListeners();
    },
  };
})(UICtrl, PokedexCtrl);

AppCtrl.init();
