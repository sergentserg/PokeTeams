import PokedexEntryInfo from './PokedexEntryInfo';
import { capitalize } from 'src/shared/util/capitalize';
import { pokedexState } from '../PokedexState';

export default class PokedexEntryAbilities extends PokedexEntryInfo {
  constructor() {
    super('Abilities', 'abilities');

    // Abiity list.
    this.list = document.createElement('ul');
    this.list.classList = 'list-group';
    this.cardBody.append(this.list);
  }

  get() {
    return this.card;
  }

  async update() {
    // Clear ability list.
    while (this.list.firstElementChild) this.list.firstElementChild.remove();

    // Populate new abilities.
    const abilities = pokedexState.getPokemon().abilities;
    abilities.forEach(async (slot) => {
      const res = await fetch(slot.ability.url);
      const data = await res.json();

      const enAbility = data.effect_entries.find(
        (entry) => entry.language.name === 'en'
      );
      const abilityEffect = enAbility.short_effect;
      const li = document.createElement('li');
      li.classList.add('list-group-item');

      li.innerHTML = `
          <div class="d-flex justify-content-between align-items-center">
            <strong>${capitalize(slot.ability.name)}</strong>
            <i class="far fa-eye"></i>
          </div>
          ${
            slot.is_hidden
              ? '<small class="text-success">Hidden Ability</small><br>'
              : ''
          }
          <small class="text-muted">${abilityEffect}</small>
      `;
      this.list.append(li);
    });
  }
}
