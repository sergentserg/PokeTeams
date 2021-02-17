// Global Constants
const MAX_DEX_ID = 807;
const MAX_MOVES = 813;
const GAME_VERSION = 'ultra-sun-ultra-moon';
const POKEMON_URL = 'https://pokeapi.co/api/v2/pokemon';
const MOVES_URL = `https://pokeapi.co/api/v2/move?limit=${MAX_MOVES}`;
const MOVE_PRIORITY_COUNT = 13;
const SLOWEST_MOVE = -7;

// Utility Functions
function debounce(fn, ms) {
  let timer = 0;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(fn.bind(this, ...args), ms || 0);
  };
}

function pokeSpriteURL(dexID) {
  return `https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${dexID}.png`;
}

async function logout() {
  const LOGOUT_URL = 'http://127.0.0.1:5000/api/v1/auth/logout';
  const res = await fetch(LOGOUT_URL, {
    method: 'GET',
    credentials: 'include',
  });
  const data = await res.json();
  if (!data.success) {
    console.log('Not allowed to be here.');
  } else {
    location.replace('signin.html');
  }
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

const sidenavToggler = document.querySelector('#sidenavToggler');
if (sidenavToggler) {
  sidenavToggler.addEventListener('click', () => {
    document.querySelector('.side-nav').classList.toggle('show-sidenav');
  });
}
