// capitalizeWord and getPokemon from index.js

window.addEventListener("load", (e) => {
  const pokemon = JSON.parse(localStorage.getItem("currentPokemon"));
  document.querySelector(
    "#breadcrumbCurrent"
  ).innerHTML = `#${pokemon.dexID} ${pokemon.name}`;
  document.querySelector("#pokedexID").innerHTML = `${pokemon.dexID}`;
  document.querySelector("#pokeName").innerHTML = `${pokemon.name}`;
  document.querySelector("#pokeImgContainer").innerHTML = `
      <img 
        src="https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${pokemon.dexID}.png" 
        alt="${pokemon.name}"
      />
    `;

  // Display the types
  displayTypes(pokemon.types);

  document.querySelector("#height").innerHTML = `${pokemon.height} m`;
  document.querySelector("#weight").innerHTML = `${pokemon.weight} kg`;

  // Display the bars for the stats.
  const hpBar = document.querySelector("#hpBar");
  const atkBar = document.querySelector("#atkBar");
  const defBar = document.querySelector("#defBar");
  const spatkBar = document.querySelector("#spatkBar");
  const spdefBar = document.querySelector("#spdefBar");
  const spdBar = document.querySelector("#spdBar");

  const allStats = [hpBar, atkBar, defBar, spatkBar, spdefBar, spdBar];
  for (let i = 0; i < allStats.length; i++) {
    allStats[i].style.width = `${(100 * pokemon.stats[i].base_stat) / 255}%`;
    allStats[i].setAttribute("aria-valuenow", `${pokemon.stats[i].base_stat}`);
    allStats[i].innerHTML = `${pokemon.stats[i].base_stat}`;
  }

  // Display the abilities.
  displayAbilities(pokemon.abilities);

  // Enable move filters.
  const lvFilter = document.querySelector("#lvFilter");
  lvFilter.addEventListener("click", (e) => {
    displayMoves(pokemon.moves.levelUp, lvFilter);
  });

  const eggFilter = document.querySelector("#eggFilter");
  eggFilter.addEventListener("click", (e) => {
    displayMoves(pokemon.moves.egg, eggFilter);
  });

  const tmFilter = document.querySelector("#tmFilter");
  tmFilter.addEventListener("click", (e) => {
    displayMoves(pokemon.moves.machine, tmFilter);
  });

  // Display the level up moves by default.
  displayMoves(pokemon.moves.levelUp, lvFilter);

  // Display the navigation buttons
  createNavButtons(pokemon.previous, pokemon.next);
});

const displayTypes = (types) => {
  const pokemonTypeContainer = document.querySelector("#pokeType");
  types.forEach((slot) => {
    // Parse the name.
    const type = slot.type.name;
    const typeName = capitalizeWord(type);

    // Insert type badge.
    const pokemonTypeData = document.createElement("small");
    pokemonTypeData.classList.add(`type-${type}`, "mx-1");
    pokemonTypeData.innerHTML = `${typeName}`;
    pokemonTypeContainer.appendChild(pokemonTypeData);
  });
};

const displayAbilities = (abilities) => {
  const pokemonAbilityContainer = document.querySelector("#pokeAbilities");

  // Pokemon vary between 1 - 3 abilities, usually 1 hidden
  abilities.forEach(async (slot) => {
    const response = await fetch(slot.ability.url);
    const abilityDetails = await response.json();

    const abilityName = capitalizeWord(slot.ability.name);

    const pokemonAbilityLi = document.createElement("li");
    pokemonAbilityLi.classList.add("list-group-item");

    const englishAbility = abilityDetails.effect_entries.filter(
      (effectEntry) => effectEntry.language.name === "en"
    );
    const abilityEffect = englishAbility[0].short_effect;

    pokemonAbilityLi.innerHTML = `
      <div class="d-flex justify-content-between align-items-center">
        <strong>${abilityName}</strong>
        <i class="far fa-eye"></i>
      </div>
      ${
        slot.is_hidden
          ? '<small class="text-success">Hidden Ability</small><br>'
          : ""
      }
      <small class="text-muted">${abilityEffect}</small>`;

    pokemonAbilityContainer.appendChild(pokemonAbilityLi);
  });
};

const displayMoves = (moves, filterElement) => {
  document.querySelector("#moves .view-item").classList.remove("view-item");
  filterElement.classList.add("view-item");

  // Empty out current moves.
  const moveContainer = document.querySelector("#moveNames");
  while (moveContainer.firstElementChild) {
    moveContainer.firstElementChild.remove();
  }

  // Display the relevant moves.
  moves.forEach((move) => {
    const moveName = capitalizeWord(move.name);
    const moveLink = document.createElement("a");
    moveLink.classList.add(
      "btn",
      "text-primary",
      "bg-light",
      "border",
      "rounded",
      "p-1",
      "mb-1",
      "mr-1"
    );
    const level = move.level
      ? `<span class="text-success">Lv. ${move.level}</span>`
      : ``;
    moveLink.innerHTML = `<small>${level} ${moveName}</small>`;
    moveLink.addEventListener("click", showMovePage);
    moveContainer.appendChild(moveLink);
  });
};

// Generate navigation buttons on pokemon page.
const createNavButtons = (previous, next) => {
  const navContainer = document.querySelector(".pagination");

  // Empty Li
  const prevLi = document.createElement("li");

  // All pokemon EXCEPT Bulbasaur receive active previous button.
  if (previous) {
    prevLi.classList.add("page-item");
    prevLi.innerHTML = `
      <button href="#" class="page-link">&#8592; #${previous.dexID} ${previous.name}</button>`;
    prevLi.firstElementChild.addEventListener("click", (e) => {
      // updateDisplayedPokemon(previous);
      getPokemon(parseInt(previous.dexID) - 1);
    });
  }

  // Empty Li
  const nextLi = document.createElement("li");

  // All pokemon EXCEPT Zeraora receive active next button.
  if (next) {
    nextLi.classList.add("page-item");
    nextLi.innerHTML = `
      <button href="#" class="page-link">&#8594; #${next.dexID} ${next.name}</button>`;
    nextLi.firstElementChild.addEventListener("click", (e) => {
      // updateDisplayedPokemon(next);
      getPokemon(parseInt(next.dexID) - 1);
    });
  }
  navContainer.appendChild(prevLi);
  navContainer.appendChild(nextLi);
};

const showMovePage = (e) => {
  // Determine which move anchor tag was clicked.
  // Make call to API.
  // Redirect user to the move page.
};
