import { capitalize } from 'src/shared/util/capitalize';

import { dexNoFromId } from 'src/shared/util/dexNoFromId';

const POKE_API_URL = 'https://pokeapi.co/api/v2';
// `https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${dexID}.png`;
export const POKE_SPRITE_URL = `https://assets.pokemon.com/assets/cms2/img/pokedex/detail`;
export const GAME_VERSION = 'ultra-sun-ultra-moon';

export class PokedexState {
  constructor() {
    this.MAX_DEX_ID = 807;
    this.POKE_PER_PAGE = 20;
    this.currentPage = 1;
    this.totalPages = Math.ceil(this.MAX_DEX_ID / this.POKE_PER_PAGE);
    this.pokemons = [];
    // Index array for this.pokemons.
    this.filtered = [];
  }

  // Meant to be called from constructor only.
  async init() {
    const res = await fetch(`${POKE_API_URL}/pokemon?limit=${this.MAX_DEX_ID}`);
    const data = await res.json();
    this.pokemons = data.results;
    this.filtered = this.pokemons;
  }

  async getPokemon(dexID) {
    const res = await fetch(`${POKE_API_URL}/pokemon/${parseInt(dexID)}`);
    const pokemonData = await res.json();
    const {
      name,
      sprites,
      height,
      weight,
      types,
      stats,
      abilities,
    } = pokemonData;

    // Parse moves.
    const moves = { egg: [], machine: [], levelUp: [] };
    pokemonData.moves.forEach((item) => {
      // Find correct move version.
      const versions = item.version_group_details;
      const move = versions.find(
        (version) => version.version_group.name === GAME_VERSION
      );
      if (move) {
        // Save to appropriate list.
        const name = item.move.name;
        const method = move.move_learn_method.name;
        if (method === 'egg') moves.egg.push({ name, method });
        else if (method === 'machine') moves.machine.push({ name, method });
        else if (method === 'level-up')
          moves.levelUp.push({
            name,
            method,
            level: move.level_learned_at,
          });
      }
    });

    return {
      dexID,
      name: capitalize(name),
      sprites,
      height: height / 10,
      weight: weight / 10,
      types,
      stats,
      abilities,
      moves,
      next: +dexID < this.MAX_DEX_ID ? dexNoFromId(+dexID + 1) : null,
      previous: +dexID > 1 ? dexNoFromId(+dexID - 1) : null,
    };
  }

  setPageNumber(pageNum) {
    this.currentPage = pageNum;
  }

  getPageNumber() {
    return this.currentPage;
  }

  getTotalPages() {
    return this.totalPages;
  }

  getPage() {
    const startIndex = (this.currentPage - 1) * this.POKE_PER_PAGE;
    // This creates a shallow copy.
    const pokemonPage = this.filtered.slice(
      startIndex,
      startIndex + this.POKE_PER_PAGE
    );

    // Set Pokedex ID and capitalized name (lazy).
    pokemonPage.forEach((pokemon) => {
      const id = parseInt(pokemon.url.match(/\/(\d+)\//)[1]);
      pokemon.dexID = dexNoFromId(id);
      pokemon.name = capitalize(pokemon.name);
    });
    return pokemonPage;
  }

  filterPokemons(searchQuery) {
    sessionStorage.setItem('searchQuery', searchQuery);

    this.filtered = this.pokemons.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(searchQuery)
    );
    this.totalPages = Math.ceil(this.filtered.length / this.POKE_PER_PAGE);
    this.currentPage = 1;
  }

  clearFilter() {
    sessionStorage.removeItem('searchQuery');
    this.filtered = this.pokemons;
    this.totalPages = Math.ceil(this.MAX_DEX_ID / this.POKE_PER_PAGE);
    this.currentPage = 1;
  }
}
