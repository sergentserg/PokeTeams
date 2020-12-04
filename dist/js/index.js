// Global Constants
const MAX_DEX_ID = 807;
const GAME_VERSION = 'ultra-sun-ultra-moon';
const POKEDEX_URL = `https://pokeapi.co/api/v2/pokemon?limit=${MAX_DEX_ID}`;
const POKEMON_URL = 'https://pokeapi.co/api/v2/pokemon';

const POKE_PER_PAGE = 20;
const PAGINATION_LIMIT = 5;

// const mobileMediaQuery = window.matchMedia('(max-width: 576px)');
// if (mobileMediaQuery.matches) {
//   PAGINATION_LIMIT = 1;
// } else {
//   PAGINATION_LIMIT = 5;
// }

// Utility Functions
function dexIDFromID(id) {
  return ('00' + id).substr(-3, 3);
}

function capitalize(str) {
  return str[0].toUpperCase() + str.substr(1);
}

function pokeSpriteURL(dexID) {
  return `https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${dexID}.png`;
}

// Redirect if no token.
function authenticate() {
  // Get token from local storage.
  // const token = sessionStorage.getItem('jwt');
  // If no token, redirect to login page.
  // window.location.href = 'login.html';
}

function parseMoves(moves) {
  const egg = [],
    machine = [],
    levelUp = [];
  moves.forEach((item) => {
    // Find correct move version.
    const versions = item.version_group_details;
    const move = versions.find(
      (version) => version.version_group.name === GAME_VERSION
    );
    if (move) {
      // Save to appropriate list.
      const name = item.move.name;
      const method = move.move_learn_method.name;
      if (method === 'egg') egg.push({ name, method });
      else if (method === 'machine') machine.push({ name, method });
      else if (method === 'level-up')
        levelUp.push({
          name,
          method,
          level: move.level_learned_at,
        });
    }
  });
  return { egg, machine, levelUp };
}

async function getPokemon(dexID) {
  const response = await fetch(`${POKEMON_URL}/${parseInt(dexID)}`);
  const pokemonData = await response.json();
  const {
    name,
    sprites,
    height,
    weight,
    types,
    stats,
    abilities,
  } = pokemonData;

  return {
    dexID: dexID,
    name: capitalize(name),
    sprites,
    height: height / 10,
    weight: weight / 10,
    types,
    stats,
    abilities,
    moves: parseMoves(pokemonData.moves),
    next: +dexID < MAX_DEX_ID ? dexIDFromID(+dexID + 1) : null,
    previous: +dexID > 1 ? dexIDFromID(+dexID - 1) : null,
  };
}
