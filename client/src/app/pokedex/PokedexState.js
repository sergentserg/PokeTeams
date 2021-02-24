import { capitalize } from 'src/shared/util/capitalize';

import { dexNoFromId } from 'src/shared/util/dexNoFromId';
import { POKE_API_URL, GAME_VERSION } from 'src/shared/util/constants';

class PokedexState {
  constructor() {
    this.MAX_DEX_ID = 807;
    this.POKE_PER_PAGE = 20;
    this.currentPage = 1;
    this.totalPages = Math.ceil(this.MAX_DEX_ID / this.POKE_PER_PAGE);
    this.pokemons = [];
    // Index array for this.pokemons.
    this.filtered = [];
    this.currentPokemon = null;
  }

  // Meant to be called from constructor only.
  async init() {
    const res = await fetch(`${POKE_API_URL}/pokemon?limit=${this.MAX_DEX_ID}`);
    const data = await res.json();
    this.pokemons = data.results;

    // Set Pokedex ID and capitalized name (lazy).
    this.pokemons.forEach((pokemon) => {
      const id = parseInt(pokemon.url.match(/\/(\d+)\//)[1]);
      pokemon.dexID = dexNoFromId(id);
      pokemon.name = capitalize(pokemon.name);
    });
    this.filtered = this.pokemons;
  }

  getPokemon() {
    return this.currentPokemon;
  }

  async setPokemon(dexID) {
    const res = await fetch(`${POKE_API_URL}/pokemon/${parseInt(dexID)}`);
    this.currentPokemon = await res.json();

    // Parse moves.
    const moves = { egg: [], machine: [], levelUp: [] };
    this.currentPokemon.moves.forEach((item) => {
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
    this.currentPokemon.moves = moves;

    this.currentPokemon.name = capitalize(this.currentPokemon.name);
    this.currentPokemon.dexID = dexNoFromId(this.currentPokemon.id);
    this.currentPokemon.height /= 10;
    this.currentPokemon.weight /= 10;
    this.currentPokemon.next =
      +dexID < this.MAX_DEX_ID ? dexNoFromId(+dexID + 1) : null;
    this.currentPokemon.previous = +dexID > 1 ? dexNoFromId(+dexID - 1) : null;
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
    return pokemonPage;
  }

  getAllPokemon() {
    return this.pokemons;
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

export const pokedexState = new PokedexState();
