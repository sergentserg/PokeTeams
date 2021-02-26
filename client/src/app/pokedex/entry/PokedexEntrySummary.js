import { POKE_SPRITE_URL } from 'src/shared/util/constants';
import { capitalize } from 'src/shared/util/capitalize';
import { pokedexState } from '../PokedexState';

export default class PokedexEntrySummary {
  constructor() {
    this.summary = document.createElement('div');
    this.summary.classList = 'border';
    this.summary.id = 'summaryCard';

    // Sprite
    this.sprite = document.createElement('div');
    this.summary.append(this.sprite);
    this.sprite.classList = 'd-flex justify-content-center';

    // Name
    this.name = document.createElement('h4');
    this.name.classList = 'text-center';
    this.summary.append(this.name);

    // Types
    this.types = document.createElement('div');
    this.types.classList = `d-flex justify-content-center py-2 border-top bg-secondary`;
    this.summary.append(this.types);

    // Pokedex Number, height, and weight.
    this.miscDetails = document.createElement('div');
    this.miscDetails.classList = 'text-center';
    this.summary.append(this.miscDetails);

    this.dexID = this.makeSummaryRow('Pokédex No.');
    this.height = this.makeSummaryRow('Height');
    this.weight = this.makeSummaryRow('Weight');
  }

  get() {
    return this.summary;
  }

  update() {
    const data = pokedexState.getPokemon();

    // Sprite
    this.sprite.innerHTML = `
      <img src="${POKE_SPRITE_URL}/${data.dexID}.png" alt="${data.name}"/>
    `;

    // Name
    this.name.textContent = data.name;

    // Types
    let content = '';
    data.types.forEach((slot) => {
      const type = slot.type.name;
      content += `<small class="type-${type} mx-1">${capitalize(type)}</small>`;
    });
    this.types.innerHTML = content;

    // Pokedex Number, height, and weight.
    this.dexID.textContent = `${data.dexID}`;
    this.height.textContent = `${data.height} cm`;
    this.weight.textContent = `${data.weight} g`;
  }

  makeSummaryRow(title) {
    const row = document.createElement('div');
    row.classList = 'd-flex justify-content-around border-bottom';
    this.miscDetails.append(row);

    const header = document.createElement('strong');
    header.classList = 'border-right w-100 flex-grow';
    header.textContent = title;
    row.append(header);

    const span = document.createElement('span');
    span.classList = 'w-100 flex-grow';
    row.append(span);
    return span;
  }
}
