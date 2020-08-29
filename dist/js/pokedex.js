window.addEventListener("load", async (e) => {
  if (!localStorage.getItem("allPokemon")) {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=${MAX_DEX_ID}`
    );
    const allPokemon = await response.json();

    // Update name and dexID for all pokemon.
    allPokemon.results.forEach((pokemon, index) => {
      pokemon.dexID = pokemon.url.split("/")[6];
      pokemon.dexID = ("000" + pokemon.dexID).substr(-3, 3);
      pokemon.name = capitalizeWord(pokemon.name);
    });

    // Save 'Pokedex' to local storage.
    localStorage.setItem("allPokemon", JSON.stringify(allPokemon));
  }

  document
    .querySelector("#pokemonSearchBtn")
    .addEventListener("click", searchPokemon);

  populateResults();
});

const searchPokemon = (event) => {
  // Search Filter!
  // Grab user search query
  const searchQuery = document
    .querySelector("#pokemonSearchInput")
    .value.toLowerCase();

  if (searchQuery !== "") {
    // Store or overwrite search query
    sessionStorage.setItem("searchQuery", searchQuery);

    // Populate those damn results
    populateResults();

    // Do not reload page.
    event.preventDefault();
  }
};

const getPokemonQuery = () => {
  // Get list of Pokemon matching search query.
  const allPokemon = JSON.parse(localStorage.getItem("allPokemon"));
  const searchQuery = sessionStorage.getItem("searchQuery");

  // the entire pokedex array or a filtered array.
  if (searchQuery) {
    const results = allPokemon.results.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(searchQuery)
    );
    return results;
  } else {
    return allPokemon.results;
  }
};

const populateResults = (newFirstPageNum = 1, newActivePageNum = 1) => {
  const resultsContainer = document.querySelector("#pokeSearchResults");
  while (resultsContainer.firstElementChild) {
    resultsContainer.firstElementChild.remove();
  }

  const results = getPokemonQuery();
  const offset = POKE_PER_PAGE * (newActivePageNum - 1);
  // Display filtered Pokemon cards.
  for (
    let i = offset;
    i < Math.min(results.length, offset + POKE_PER_PAGE);
    i++
  ) {
    createPokemonCard(results[i]);
  }

  createPagination(results, newFirstPageNum, newActivePageNum);

  const searchQuery = sessionStorage.getItem("searchQuery");
  if (searchQuery) {
    createFilterBtn(searchQuery);
  }
};

const createFilterBtn = (searchQuery) => {
  // Render search query as a visible button
  const filterContainer = document.querySelector(".filter-list");
  // Clear filter container
  if (filterContainer.firstElementChild) {
    filterContainer.firstElementChild.remove();
  }

  filterContainer.innerHTML = `
 <button class="btn btn-dark filter-tag">"${searchQuery}" <i class="fas fa-times-circle fa-xs"></i>
 </button>`;
  filterContainer
    .querySelector(".filter-tag")
    .addEventListener("click", removeFilter);
};

const removeFilter = (event) => {
  // Reset search form
  document.querySelector(".search-form").reset();
  // Remove filter tag button element
  document.querySelector(".filter-tag").remove();
  // Clear current results from session storage.
  if (sessionStorage.getItem("searchQuery")) {
    sessionStorage.removeItem("searchQuery");
  }

  populateResults();
};

const createPokemonCard = (pokemon) => {
  // Create pokemon card.
  const pokemonCard = document.createElement("div");
  pokemonCard.classList.add("pokemon-card", "border");
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
  pokemonCard
    .querySelector(".poke-details-btn")
    .addEventListener("click", () => {
      // Passing in json index of pokemon
      getPokemon(parseInt(pokemon.dexID) - 1);
    });

  const resultsContainer = document.querySelector("#pokeSearchResults");
  resultsContainer.appendChild(pokemonCard);
};

const createPagination = (
  results,
  newFirstPageNum = 1,
  newActivePageNum = 1
) => {
  // --------------------------- RESET PAGINATION ------------------------------------
  // Pagination ul element.
  const pagination = document.querySelector(".pagination");
  const firstLi = pagination.firstElementChild;
  const lastLi = pagination.lastElementChild;
  const prevLi = firstLi.nextElementSibling;
  const nextLi = lastLi.previousElementSibling;

  while (prevLi.nextElementSibling !== nextLi) {
    prevLi.nextElementSibling.remove();
  }

  // ----------------------------- CREATE PAGINATION ELEMENTS ------------------------
  // Calculate total number of pages needed
  const totalPages = Math.ceil(results.length / POKE_PER_PAGE);
  if (results.length <= POKE_PER_PAGE) {
    pagination.parentElement.classList.add("d-none");
  } else {
    // Display up to 5 page links in pagination.
    for (
      let offset = 0;
      offset < Math.min(totalPages, PAGINATION_LIMIT);
      offset++
    ) {
      // Create the pagination element.
      const li = document.createElement("li");
      // i.e. 1+0, 1+1 ... 1+4  OR  37+0, 37+1 ... 37+4
      li.classList.add("page-item");
      li.setAttribute(`data-page-num`, `${newFirstPageNum + offset}`);
      li.innerHTML = `<button href="#" class="page-link">${
        newFirstPageNum + offset
      }</button>`;

      // Insert it before next.
      pagination.insertBefore(li, nextLi);
    }

    // ------------------------------------- ACTIVE --------------------------------------
    // Make active li unclickable.
    const allPageLis = Array.from(
      document.querySelectorAll(`[data-page-num="${newActivePageNum}"]`)
    );
    const activeLi = allPageLis.filter(
      (li) => li.getAttribute("data-page-num") === `${newActivePageNum}`
    )[0];
    activeLi.classList.add("active");
    activeLi.style.pointerEvents = "none";

    // Active Page is in between 1 and LAST
    if (newActivePageNum > 1 && newActivePageNum < totalPages) {
      firstLi.classList.remove("disabled");
      prevLi.classList.remove("disabled");
      nextLi.classList.remove("disabled");
      lastLi.classList.remove("disabled");
    } else if (newActivePageNum === 1) {
      firstLi.classList.add("disabled");
      prevLi.classList.add("disabled");
      nextLi.classList.remove("disabled");
      lastLi.classList.remove("disabled");
    } else if (newActivePageNum === totalPages) {
      firstLi.classList.remove("disabled");
      prevLi.classList.remove("disabled");
      nextLi.classList.add("disabled");
      lastLi.classList.add("disabled");
    }

    // ------------------------------ DISPLAY ELLIPSIS -------------------------------------
    // Need at least 5 pages for ellipses.
    if (totalPages > PAGINATION_LIMIT) {
      // Create ellipses element.
      const li = document.createElement("li");
      li.classList.add("page-item", "disabled");
      li.setAttribute("data-page-num", "ellipsis");
      li.innerHTML = `<button href="#" class="page-link">...</button>`;

      // Ellipsis on the left.
      if (totalPages - newFirstPageNum < PAGINATION_LIMIT) {
        const newFirstPageLi = prevLi.nextElementSibling;
        pagination.insertBefore(li, newFirstPageLi);
      } else {
        // Ellipsis on right.
        pagination.insertBefore(li, nextLi);
      }
    }

    // Display it in the UI.
    pagination.parentElement.classList.remove("d-none");

    // Add event listeners for all.
    Array.from(pagination.children).forEach((li) => {
      li.firstElementChild.addEventListener("click", displayNewPage);
    });
  }
};

const displayNewPage = (event) => {
  const { newFirstPageNum, newActivePageNum } = updatePagination(event);
  populateResults(newFirstPageNum, newActivePageNum);
};

const updatePagination = (event) => {
  const buttonClickText = event.target.innerHTML;

  // pokemonData is the entire pokedex array or a filtered array.
  const results = getPokemonQuery();
  const totalPages = Math.ceil(results.length / POKE_PER_PAGE);

  // Determine updated values for the active page number, and the new first in the pagination.
  let newFirstPageNum = 1,
    newActivePageNum = 1;
  if (buttonClickText == "Last") {
    // More than 5 pages? Start at offset, otherwise Start at 1
    newFirstPageNum =
      totalPages > PAGINATION_LIMIT ? totalPages - (PAGINATION_LIMIT - 1) : 1;
    newActivePageNum = totalPages;
  } else if (buttonClickText === "&gt;&gt;") {
    // (Next >>)
    const currentPageNum = parseInt(
      document.querySelector(".pagination .active button").innerHTML
    );
    if (totalPages > PAGINATION_LIMIT) {
      if (totalPages - currentPageNum < PAGINATION_LIMIT) {
        newFirstPageNum = totalPages - (PAGINATION_LIMIT - 1);
      } else {
        newFirstPageNum = currentPageNum + 1;
      }
    }
    newActivePageNum = currentPageNum + 1;
  } else if (buttonClickText === "&lt;&lt;") {
    const currentPageNum = parseInt(
      document.querySelector(".pagination .active button").innerHTML
    );
    if (totalPages > PAGINATION_LIMIT) {
      if (totalPages - currentPageNum < PAGINATION_LIMIT - 1) {
        newFirstPageNum = totalPages - (PAGINATION_LIMIT - 1);
      } else {
        newFirstPageNum = currentPageNum - 1;
      }
    }
    newActivePageNum = currentPageNum - 1;
  } else if (!isNaN(buttonClickText)) {
    // Clicked number in pagination.
    newActivePageNum = parseInt(buttonClickText);
    if (totalPages > PAGINATION_LIMIT) {
      if (totalPages - newActivePageNum < PAGINATION_LIMIT) {
        newFirstPageNum = totalPages - (PAGINATION_LIMIT - 1);
      } else {
        newFirstPageNum = newActivePageNum;
      }
    }
  }
  return {
    newFirstPageNum,
    newActivePageNum,
  };
  // Re-create pagination with defined parameters
  // createPagination(results, newFirstPageNum, newActivePageNum);
};
