export const API_URL = 'http://127.0.0.1:5000/api/v1';
export const POKE_API_URL = 'https://pokeapi.co/api/v2';

// `https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${dexID}.png`;
export const POKE_SPRITE_URL = `https://assets.pokemon.com/assets/cms2/img/pokedex/detail`;
export const GAME_VERSION = 'ultra-sun-ultra-moon';

export const MOVE_PRIORITY_COUNT = 13;
export const SLOWEST_MOVE = -7;
export const MAX_MOVES = 813;
export const INPUT_DELAY = 500;

export const PAGINATION_LIMIT = window.matchMedia('(max-width: 576px)').matches
  ? 1
  : 5;
