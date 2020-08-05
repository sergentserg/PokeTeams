// Default spread is pokedex national order
// Grab Sprite - use as bg-image for card
// Grab pokemon typage
// Grab pokemon name

const MAX_DEX_ID = 807;
const POKE_PER_PAGE = 20;
window.addEventListener("load", (e) => {
  // Do not request again on refresh; save result once to storage.
  if (!localStorage.getItem("allPokemon")) {
    getAsync(`https://pokeapi.co/api/v2/pokemon?limit=${MAX_DEX_ID}`).then(
      (allPokemon) => {
        // Save 'Pokedex' to local storage.
        localStorage.setItem("allPokemon", JSON.stringify(allPokemon));
        for (let i = 0; i < POKE_PER_PAGE; i++) {
          displayPokemonCard(allPokemon.results[i]);
        }
        // Display the pagination.
        createPagination(allPokemon.results);
      }
    );
  } else {
    // Already in local storage; retrieve it.
    console.log("already saved!");
    const allPokemon = JSON.parse(localStorage.getItem("allPokemon"));

    for (let i = 0; i < POKE_PER_PAGE; i++) {
      displayPokemonCard(allPokemon.results[i]);
    }
    // Display the pagination.
    createPagination(allPokemon.results);
  }
});

async function getAsync(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw Error(`Failed to get response from ${url}.`);
    }
    return await response.json();
  } catch (e) {
    console.log(e);
  }
}

const searchPokemon = (event) => {
  // Search Filter!
  const searchQuery = document.querySelector("#pokemonSearchInput").value;
  if (searchQuery !== "") {
    const allPokemon = JSON.parse(localStorage.getItem("allPokemon"));

    // Get list of Pokemon matching search query.
    const results = allPokemon.results.filter(
      (pokemon) => pokemon.name.indexOf(searchQuery) != -1
    );

    // Save results to session storage.
    const currentResults = {
      searchQuery,
      results,
    };
    sessionStorage.setItem("currentResults", JSON.stringify(currentResults));

    // Clean out old Search results
    const resultsContainer = document.querySelector("#pokeSearchResults");
    while (resultsContainer.firstElementChild) {
      resultsContainer.firstElementChild.remove();
    }

    // Display filtered Pokemon cards.
    for (let i = 0; i < Math.min(results.length, POKE_PER_PAGE); i++) {
      displayPokemonCard(results[i]);
    }

    createPagination(results);

    // Do not reload page.
    event.preventDefault();
  }
};

const displayPokemonCard = (pokemon) => {
  const resultsContainer = document.querySelector("#pokeSearchResults");

  // Assign Pokedex DexID as an attribute.
  pokemon.dexID = pokemon.url.split("/")[6];
  // Append 0s to Pokemon DexID until total of 3 digits
  while (pokemon.dexID.length < 3) {
    pokemon.dexID = "0" + pokemon.dexID;
  }

  // Capitalize pokemon name
  pokemon.name = pokemon.name[0].toUpperCase() + pokemon.name.slice(1);

  // Display the Pokemon card.
  resultsContainer.innerHTML += `
  <div class="pokemon-card border">
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
        src="https://pokeres.bastionbot.org/images/pokemon/${parseInt(
          pokemon.dexID
        )}.png"
        alt="${pokemon.name}"
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

    <button class="btn btn-block btn-dark poke-details-btn">
       ${pokemon.dexID} ${pokemon.name}
      <i class="fas fa-eye"></i>
    </button>
  </div>`;
};

// If numberPages == 1, pagination is not needed
const createPagination = (results) => {
  // Calculate total number of pages needed
  const numberPages = Math.ceil(results.length / POKE_PER_PAGE);

  // Pagination ul element.
  const pagination = document.querySelector(".pagination");
  const firstBtn = pagination.firstElementChild;
  const lastBtn = pagination.lastElementChild;
  const prevBtn = firstBtn.nextElementSibling;
  const nextBtn = lastBtn.previousElementSibling;

  // Show only next and previous.
  // while (
  //   pagination.firstElementChild.nextElementSibling !==
  //   pagination.lastElementChild
  // ) {
  //   pagination.firstElementChild.nextElementSibling.remove();
  // }
  while (prevBtn.nextElementSibling !== nextBtn) {
    prevBtn.nextElementSibling.remove();
  }

  if (results.length <= POKE_PER_PAGE) {
    firstBtn.classList.add("disabled");
    lastBtn.classList.remove("disabled");
    pagination.parentElement.classList.add("d-none");
  } else {
    // Display up to 5 page links in pagination.
    for (let pageNum = 1; pageNum <= Math.min(numberPages, 5); pageNum++) {
      // Create the pagination element.
      const li = document.createElement("li");
      li.classList.add("page-item", `pagination-${pageNum}`);
      li.innerHTML = `<button href="#" class="page-link">${pageNum}</button>`;

      // Insert it before next.
      pagination.insertBefore(li, nextBtn);
    }

    pagination.children[2].classList.add("active");
    pagination.children[2].style.pointerEvents = "none";

    // Display the elipsis.
    if (numberPages > 5) {
      // Create the pagination element.
      const li = document.createElement("li");
      li.classList.add("page-item", "pagination-ellipsis", "disabled");
      li.innerHTML = `<button href="#" class="page-link">...</button>`;

      // Insert it before next.
      pagination.insertBefore(li, nextBtn);
    }

    // Add event listeners for all.
    // console.log(Array.from(pagination.children));
    Array.from(pagination.children).forEach((li) => {
      li.firstElementChild.addEventListener("click", displayNewPage);
    });

    // Display it in the UI.
    pagination.parentElement.classList.remove("d-none");
  }
};

const displayNewPage = (event) => {
  console.log(event.target.innerHTML);
};

const updatePagination = (event) => {
  const buttonContent = event.target.innerHTML;
  // First ; Prev ; an integer ; Next ; Last

  // First ; recreate the pagination

  // Last
  // assume totalPageNum > 5
  // create ..., then create pageNum - 4, pageNum - 3, pageNum - 2, pageNum - 1, [pageNum]
  // if less than or equal to 5
  // just create as usual, but make last page the current page. 1 2 3 4 [5]

  // Next
  // Cases of distance
  // Case 1: 5 pages or less: [1] 2 3 4 5 -> 1 [2] 3 4 5
  // Case 2: 6 pages exactly: [1] 2 3 4 5 ... -> ... [2] 3 4 5 6
  // Case 3: more than 6 pages: [1] 2 3 4 5 ... ->  [2] 3 4 5 6 ...
  // totalPageNum - currentPageNum < 5 -> just move active element by 1
  // totalPageNum - currentPageNum === 5 -> move ellipses to front
  // totalPageNum - currentPageNum >=  5 -> offset integers by 1.

  // Prev
  // Cases of distance
  // Case 1: 5 pages or less: 1 2 3 4 [5] -> 1 2 3 [4] 5
  // Case 2: 6 pages exactly: ... [2] 3 4 5 6 -> ... 2 3 4 5 6
  // Case 3: More than 6 pages: [2] 3 4 5 6 ... -> [1] 2 3 4 5 ...

  // Case 1: 1 2 3 4 [5] -> 1 2 3 [4] 5 OR   ... 2 [3] 4 5 6 -> ... [2] 3 4 5 6
  // (totalPageNum - currentPageNum) < (5-1) -> just move active element by 1
  // Case 2: ... [2] 3 4 5 6 -> [1] 2 3 4 5 ...
  // (totalPageNum - currentPageNum) === (5-1) -> move ellipses to end
  // Case 3: More than 6 pages: [10] 11 12 13 14 ... -> [9] 10 11 12 13 ...
  // (totalPageNum - currentPageNum) >= (5-1) -> offset integers by -1

  //  [45] 46 48 49 50 ...

  // if(< 5) {

  // } else {
  //   if (=== 5){
  //     // shift ellipses
  //   }
  //   // offset.
  // }
};

const getPokemon = (pokemon) => {
  let url = pokemon.url;

  getAsync(url).then((pokemonData) => {
    console.log(pokemonData);
  });
};

document
  .querySelector("#pokemonSearchBtn")
  .addEventListener("click", searchPokemon);
