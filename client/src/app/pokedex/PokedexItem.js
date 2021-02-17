export default function PokedexItem(pokemon) {
  const item = document.createElement('div');
  item.setAttribute('class', 'pokemon-card border');

  // Team select input.

  item.innerHTML = `
      <select class="form-control" name="teamSelect">
        <option selected disabled hidden>Choose a team</option>
        <option value="teamA">Team A</option>
        <option value="teamB">Team B</option>
        <option value="teamC">Team C</option>
      </select>
      <div
        class="poke-img-area py-4"
      >
        <img
          src="https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${pokemon.dexID}.png" alt="${pokemon.name}"
        />
        <div class="poke-card-buttons">
          <button class="btn poke-add-btn">
            <i class="fas fa-plus-circle"></i>
          </button>
          <button class="btn poke-fav-btn">
            <i class="far fa-heart"></i>
          </button>
        </div>
      </div>

      <button class="btn btn-block btn-dark poke-details-btn" data-poke-dexid="${pokemon.dexID}">
        #${pokemon.dexID} ${pokemon.name}
        <i class="fas fa-eye"></i>
      </button>`;
  return item;
}
