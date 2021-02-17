import { POKE_API_URL } from '../index';
import { capitalize } from 'src/shared/util/capitalize';

import { dexNoFromId } from 'src/shared/util/dexNoFromId';

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
