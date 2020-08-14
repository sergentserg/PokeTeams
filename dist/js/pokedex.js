window.addEventListener("load", (e) => {
  if (!localStorage.getItem("allPokemon")) {
    getAsync(`https://pokeapi.co/api/v2/pokemon?limit=${MAX_DEX_ID}`).then(
      (allPokemon) => {
        // Update name and dexID for all pokemon.
        allPokemon.results.forEach((pokemon, index) => {
          pokemon.dexID = pokemon.url.split("/")[6];
          pokemon.dexID = ("000" + pokemon.dexID).substr(-3, 3);
          pokemon.name = capitalizeWord(pokemon.name);
        })

        // Display the first 20 pokemon.
        for (let i = 0; i < POKE_PER_PAGE; i++) {
          displayPokemonCard(allPokemon.results[i]);
        }

        // Display the pagination.
        createPagination(allPokemon.results);

        // Save 'Pokedex' to local storage.
        localStorage.setItem("allPokemon", JSON.stringify(allPokemon));
      });
  } else {
    // Some results are already in storage; retrieve them.
    const results = getResultsArray();
    const searchQuery = getResultsQuery();

    for (let i = 0; i < Math.min(results.length, POKE_PER_PAGE); i++) {
      displayPokemonCard(results[i]);
    }

    // Display the pagination.
    createPagination(results);

    if (searchQuery) {
      // Render search query as a visible button
      const filterContainer = document.querySelector(".filter-list");
      filterContainer.innerHTML = `
    <button class="mt-1 btn btn-dark filter-tag">"${searchQuery}" <i class="fas fa-times-circle fa-xs"></i>
    </button>`
      filterContainer.querySelector(".filter-tag").addEventListener("click", removeFilter);
    }
  }
});

// async function getAsync(url) {
//   try {
//     const response = await fetch(url);
//     if (!response.ok) {
//       throw Error(`Failed to get response from ${url}.`);
//     }
//     return await response.json();
//   } catch (e) {
//     console.log(e);
//   }
// }

const searchPokemon = (event) => {
  // console.log("Search Pokemon Function has run.")
  // Search Filter!
  const searchQuery = document.querySelector("#pokemonSearchInput").value.toLowerCase();
  const allPokemon = JSON.parse(localStorage.getItem("allPokemon"));
  const resultsContainer = document.querySelector("#pokeSearchResults");
  if (searchQuery !== "") {
    // Clear current results from session storage.
    if (sessionStorage.getItem("currentResults")) {
      sessionStorage.removeItem("currentResults");
    }

    // Get list of Pokemon matching search query.
    const results = allPokemon.results.filter(
      (pokemon) => pokemon.name.toLowerCase().indexOf(searchQuery) != -1
    );

    // Save results to session storage.
    const currentResults = {
      searchQuery,
      results,
    };
    sessionStorage.setItem("currentResults", JSON.stringify(currentResults));

    // Clean out old Search results
    while (resultsContainer.firstElementChild) {
      resultsContainer.firstElementChild.remove();
    }

    // Display filtered Pokemon cards.
    for (let i = 0; i < Math.min(results.length, POKE_PER_PAGE); i++) {
      displayPokemonCard(results[i]);
    }

    createPagination(results);

    // Render search query as a visible button
    const filterContainer = document.querySelector(".filter-list");
    // Clear filter container
    while (filterContainer.firstElementChild) {
      filterContainer.firstElementChild.remove();
    }
    filterContainer.innerHTML = `
    <button class="mt-1 btn btn-dark filter-tag">"${searchQuery}" <i class="fas fa-times-circle fa-xs"></i>
    </button>`
    filterContainer.querySelector(".filter-tag").addEventListener("click", removeFilter);
    // const filterTag = document.createElement('button');
    // filterTag.classList.add('mt-1', 'btn', 'btn-dark', 'filter-tag');
    // filterTag.innerHTML = `"${searchQuery}" <i class="fas fa-times-circle fa-xs"></i>`;
    // filterTag.addEventListener("click", removeFilter);
    // filterContainer.appendChild(filterTag);

    // Do not reload page.
    event.preventDefault();
  }
};

const displayPokemonCard = (pokemon) => {
  // Create pokemon card.
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
        src="https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${pokemon.dexID}.png" alt="${pokemon.name}"
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

    <button class="btn btn-block btn-dark poke-details-btn" data-poke-id="${parseInt(pokemon.dexID)}">
      #${pokemon.dexID} ${pokemon.name}
      <i class="fas fa-eye"></i>
    </button>`;
  pokemonCard.querySelector('.poke-details-btn').addEventListener("click", () => {
    // Passing in json index of pokemon
    getPokemon(parseInt(pokemon.dexID) - 1);
  });

  const resultsContainer = document.querySelector("#pokeSearchResults");
  resultsContainer.appendChild(pokemonCard);
};

// If totalPages == 1, pagination is not needed
// Default active page is page 1
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
  updatePagination(event);
  const results = getResultsArray();
  // Clean out old Search results
  const resultsContainer = document.querySelector("#pokeSearchResults");
  while (resultsContainer.firstElementChild) {
    resultsContainer.firstElementChild.remove();
  }

  const activePageNum = parseInt(
    document.querySelector(".pagination .active button").innerHTML
  );
  const offset = POKE_PER_PAGE * (activePageNum - 1);
  // Display filtered Pokemon cards.
  for (
    let i = offset;
    i < Math.min(results.length, offset + POKE_PER_PAGE);
    i++
  ) {
    displayPokemonCard(results[i]);
  }
};

const getResultsArray = () => {
  const currentResults = JSON.parse(sessionStorage.getItem("currentResults"));
  // the entire pokedex array or a filtered array.
  if (currentResults) {
    return currentResults.results;
  } else {
    return JSON.parse(localStorage.getItem("allPokemon")).results;
  }
};

const getResultsQuery = () => {
  const currentResults = JSON.parse(sessionStorage.getItem("currentResults"));
  if (currentResults) {
    return currentResults.searchQuery;
  } else {
    return null;
  }
};

const updatePagination = (event) => {
  const buttonClickText = event.target.innerHTML;

  // pokemonData is the entire pokedex array or a filtered array.
  const pokemonData = getResultsArray();
  const totalPages = Math.ceil(pokemonData.length / POKE_PER_PAGE);

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
  // Re-create pagination with defined parameters
  createPagination(pokemonData, newFirstPageNum, newActivePageNum);
};

// const getPokemon = (event) => {
//   let btn = event.target;
//   while (!btn.classList.contains('poke-details-btn'))
//     btn = btn.parentElement;

//   const pokedexID = parseInt(btn.getAttribute("data-poke-id"));
//   const pokeIndex = pokedexID - 1;

//   const allPokemon = JSON.parse(localStorage.getItem('allPokemon'));
//   const currentPokemon = allPokemon.results[pokeIndex];

//   // Provide access to next/previous pokemon from current.

//   const next = pokedexID < MAX_DEX_ID ? allPokemon.results[pokeIndex + 1] : null;
//   const previous = pokedexID > 1 ? allPokemon.results[pokeIndex - 1] : null;

//   getAsync(currentPokemon.url).then((pokemonData) => {
//     const { abilities, height, id, sprites, stats, types, weight } = pokemonData;

//     const data = {
//       // base_experience: pokemonData.base_experience,
//       abilities,
//       height: height / 10,
//       id,
//       dexID: currentPokemon.dexID,
//       moves: getGen7Moves(pokemonData.moves), // Three arrays into property object
//       name: currentPokemon.name,
//       sprites,
//       stats,
//       types,
//       weight: weight / 10,
//       next: next,
//       previous: previous
//     };
//     localStorage.setItem('currentPokemon', JSON.stringify(data));
//     window.location.href = "pokemon.html"
//   });
// };


const removeFilter = (event) => {
  // Clear current results from session storage.
  if (sessionStorage.getItem("currentResults")) {
    sessionStorage.removeItem("currentResults");
  }
  const results = getResultsArray(); // ATM returns allPokemon results
  const resultsContainer = document.querySelector("#pokeSearchResults");
  // Reset search form
  document.querySelector(".search-form").reset();
  // Remove filter tag button element
  document.querySelector(".filter-tag").remove();

  // Clean out old Search results
  while (resultsContainer.firstElementChild) {
    resultsContainer.firstElementChild.remove();
  }
  // Display Pokemon cards
  for (let i = 0; i < Math.min(results.length, POKE_PER_PAGE); i++) {
    displayPokemonCard(results[i]);
  }
  // Display the pagination.
  createPagination(results);
}

document
  .querySelector("#pokemonSearchBtn")
  .addEventListener("click", searchPokemon);
