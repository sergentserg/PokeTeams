import { POKE_SPRITE_URL } from 'src/shared/util/constants';

export default function PokedexItem(pokemon) {
  const item = document.createElement('div');
  item.classList = 'pokemon-card border';
  // item.innerHTML = `
  //   <div class="poke-img-area py-4">
  //     <img src="${POKE_SPRITE_URL}/${pokemon.dexID}.png" alt="${pokemon.name}"/>
  //   </div>
  //   <button class="btn btn-block btn-dark poke-details-btn" data-dexID="${pokemon.dexID}">
  //     #${pokemon.dexID} ${pokemon.name} <i class="fas fa-eye"></i>
  //   </button>
  // `;
  item.innerHTML = `
    <div class="poke-img-area py-4">
      <img src="${POKE_SPRITE_URL}/${+pokemon.dexID}.png" alt="${
    pokemon.name
  }"/>
    </div>
    <button class="btn btn-block btn-dark poke-details-btn" data-dexID="${
      pokemon.dexID
    }">
      #${pokemon.dexID} ${pokemon.name} <i class="fas fa-eye"></i>
    </button>
  `;
  return item;
}
