export default function PokedexItem(pokemon) {
  const item = document.createElement('div');
  item.setAttribute('class', 'pokemon-card border');

  // Team select input.

  item.innerHTML = `
      <div
        class="poke-img-area py-4"
      >
        <img
          src="https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${pokemon.dexID}.png" alt="${pokemon.name}"
        />
      </div>

      <button class="btn btn-block btn-dark poke-details-btn" data-poke-dexid="${pokemon.dexID}">
        #${pokemon.dexID} ${pokemon.name}
        <i class="fas fa-eye"></i>
      </button>`;
  return item;
}
