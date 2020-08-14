// Default spread is pokedex national order
// Grab Sprite - use as bg-image for card
// Grab pokemon typage
// Grab pokemon name

const MAX_DEX_ID = 807;
const POKE_PER_PAGE = 20;
// Temporarily switched to let
let PAGINATION_LIMIT = 5;

// Testing media query in JS
const mobileMediaQuery = window.matchMedia("(max-width: 576px)");
if (mobileMediaQuery.matches) {
  PAGINATION_LIMIT = 1;
}
else {
  PAGINATION_LIMIT = 5;
}

shrinkSidenav = () => {
  const shrinkBtn = document.querySelector(".shrink-btn");
  const expandBtn = document.querySelector(".expand-btn");
  // const pkSidenav = document.querySelector(".side-nav");
  const sideNavText = document.querySelectorAll(".side-menu-text");
  const mainPage = document.querySelector(".main-content");

  sideNavText.forEach((text) => {
    text.style.display = "none";
  });

  // pkSidenav.style.width = "15vw";
  // mainPage.style.marginLeft = "15vw";
  shrinkBtn.style.display = "none";
  expandBtn.style.display = "inline";
  // mainPage.style.backgroundColor = "rgba(0,0,0,0)";
  mainPage.style.opacity = "1";
};

openSidenav = () => {
  const shrinkBtn = document.querySelector(".shrink-btn");
  const expandBtn = document.querySelector(".expand-btn");
  // const pkSidenav = document.querySelector(".side-nav");
  const sideNavText = document.querySelectorAll(".side-menu-text");
  const mainPage = document.querySelector(".main-content");

  sideNavText.forEach((text) => {
    text.style.display = "inline";
  });

  // pkSidenav.style.width = "40vw";
  // mainPage.style.marginLeft = "40vw";
  shrinkBtn.style.display = "inline";
  expandBtn.style.display = "none";
  // mainPage.style.backgroundColor = "rgba(0,0,0,0.1)";
  mainPage.style.opacity = "0.2";
};

// =============================================================================
// Utility functions
// =============================================================================
const capitalizeWord = (word) => {
  return word[0].toUpperCase() + word.slice(1);
}

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

const getGen7Moves = (pokemonMoves) => {
  const egg = [], machine = [], levelUp = [];

  pokemonMoves.forEach(moveData => {
    const versions = moveData.version_group_details;

    // Determine if the move is available in gen 7.
    const gen7Move = versions.filter(version =>
      version.version_group.name === "ultra-sun-ultra-moon");

    if (gen7Move.length > 0) {
      const method = gen7Move[0].move_learn_method.name;
      const move = moveData.move;
      switch (method) {
        case "egg":
          egg.push({ ...move, method });
          break;
        case "machine":
          machine.push({ ...move, method });
          break;
        case "level-up":
          levelUp.push({ ...move, method, level: gen7Move[0].level_learned_at });
          break;
      }
    }
  })
  return { egg, machine, levelUp };
}

const getPokemon = (pokeIndex) => {
  const allPokemon = JSON.parse(localStorage.getItem("allPokemon"));
  const currentPokemon = allPokemon.results[pokeIndex];

  let next = null;
  if (pokeIndex < MAX_DEX_ID - 1) {
    next = {
      name: allPokemon.results[pokeIndex + 1].name,
      dexID: allPokemon.results[pokeIndex + 1].dexID,
      url: allPokemon.results[pokeIndex + 1].url
    }
  }

  let previous = null;
  if (pokeIndex > 0) {
    previous = {
      name: allPokemon.results[pokeIndex - 1].name,
      dexID: allPokemon.results[pokeIndex - 1].dexID,
      url: allPokemon.results[pokeIndex - 1].url
    }
  }

  getAsync(currentPokemon.url).then((pokemonData) => {
    const { abilities, height, id, sprites, stats, types, weight } = pokemonData;

    const data = {
      // base_experience: pokemonData.base_experience,
      abilities,
      height: height / 10,
      id,
      dexID: currentPokemon.dexID,
      moves: getGen7Moves(pokemonData.moves),
      name: currentPokemon.name,
      sprites,
      stats,
      types,
      weight: weight / 10,
      next,
      previous
    };
    localStorage.setItem('currentPokemon', JSON.stringify(data));
    window.location.href = "pokemon.html"
  });
};