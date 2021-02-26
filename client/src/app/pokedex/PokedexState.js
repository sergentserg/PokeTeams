import { capitalize } from 'src/shared/util/capitalize';

import { dexNoFromId } from 'src/shared/util/dexNoFromId';
import {
  POKE_API_URL,
  GAME_VERSION,
  MAX_DEX_ID,
  POKE_PER_PAGE,
} from 'src/shared/util/constants';
import fetchLoad from '../../shared/util/fetchLoad';

class PokedexState {
  constructor() {
    this.currentPage = 1;
    this.totalPages = Math.ceil(MAX_DEX_ID / POKE_PER_PAGE);
    this.pokemons = [];
    this.filtered = [];
    this.currentPokemon = null;
  }

  async init() {
    const res = await fetchLoad(`${POKE_API_URL}/pokemon?limit=${MAX_DEX_ID}`);
    const data = await res.json();
    this.pokemons = data.results;

    // Set Pokedex ID and capitalized name (eager).
    this.pokemons.forEach((pokemon) => {
      const id = parseInt(pokemon.url.match(/\/(\d+)\//)[1]);
      pokemon.dexID = dexNoFromId(id);
      pokemon.name = capitalize(pokemon.name);
    });
    this.filtered = this.pokemons;
  }

  getAllPokemon() {
    return this.pokemons;
  }

  filter(searchQuery) {
    this.filtered = this.pokemons.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(searchQuery)
    );
    this.totalPages = Math.ceil(this.filtered.length / POKE_PER_PAGE);
    this.currentPage = 1;
  }

  clearFilter() {
    this.filtered = this.pokemons;
    this.totalPages = Math.ceil(MAX_DEX_ID / POKE_PER_PAGE);
    this.currentPage = 1;
  }

  getPageNumber() {
    return this.currentPage;
  }

  setPageNumber(pageNum) {
    this.currentPage = pageNum;
  }

  getTotalPages() {
    return this.totalPages;
  }

  getPage() {
    const startIndex = (this.currentPage - 1) * POKE_PER_PAGE;
    // This creates a shallow copy.
    const page = this.filtered.slice(startIndex, startIndex + POKE_PER_PAGE);
    return page;
  }

  getPokemon() {
    return this.currentPokemon;
  }

  async setPokemon(dexID) {
    const res = await fetchLoad(`${POKE_API_URL}/pokemon/${parseInt(dexID)}`);
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
    this.currentPokemon.height = Math.floor(10 * this.currentPokemon.height);
    this.currentPokemon.weight = Math.floor(100 * this.currentPokemon.weight);
    this.currentPokemon.next =
      +dexID < MAX_DEX_ID ? dexNoFromId(+dexID + 1) : null;
    this.currentPokemon.previous = +dexID > 1 ? dexNoFromId(+dexID - 1) : null;
  }
}

export const pokedexState = new PokedexState();
