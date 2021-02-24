import { capitalize } from 'src/shared/util/capitalize';
import { pokedexState } from './PokedexState';

export default class PokedexEntryAbilities {
  constructor() {
    this.card = document.createElement('div');
    this.card.classList = 'card';

    // Header
    const header = document.createElement('div');
    header.classList = 'card-header bg-danger text-white';
    header.innerHTML = `
    <h5>
      <a
        href="#abilities"
        data-parent="#detailsAccordion"
        data-toggle="collapse"
      >
        Abilities
      </a>
    </h5>
  `;
    this.card.append(header);

    // Collapse.
    const collapse = document.createElement('div');
    collapse.classList = 'collapse';
    collapse.id = 'abilities';
    this.card.append(collapse);

    // Body.
    const body = document.createElement('div');
    body.classList = 'body';
    collapse.append(body);

    // Abiity list.
    this.list = document.createElement('ul');
    this.list.classList = 'list-group';
    body.append(this.list);
  }

  getComponent() {
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
