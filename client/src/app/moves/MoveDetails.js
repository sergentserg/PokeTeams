import { GAME_VERSION } from 'src/shared/util/constants';
import { capitalize } from 'src/shared/util/capitalize';
import { moveState } from './MoveState';

export default class MoveDetails {
  constructor() {
    this.row = document.createElement('div');
    this.row.classList = 'row';

    this.ids = {
      moveName: 'moveName',
      moveDescription: 'moveDescription',
      moveCategory: 'moveCategory',
      movePower: 'movePower',
      moveAccuracy: 'moveAccuracy',
      moveType: 'moveType',
      movePP: 'movePP',
      moveEffectChance: 'moveEffectChance',
      moveTarget: 'moveTarget',
      moveIntroduced: 'moveIntroduced',
      effectContainer: 'effectContainer',
      effectEntry: 'effectEntry',
    };

    this.row.innerHTML = `
      <div id="moveDetails" class="col-md-4">
        <h2 id="${this.ids.moveName}" class="text-secondary mb-3"></h2>
        <div class="bg-light p-2 mb-2 border">
          <small class="text-muted">Description</small>
          <p id="${this.ids.moveDescription}">
          </p>
        </div>
  
        <div id="moveStats" class="text-center">
          <div class="border d-flex">
            <div class="w-50 p-2 bg-danger text-white">
              <strong>Category</strong>
            </div>
            <span id="${this.ids.moveCategory}" class="m-2 w-50">
            </span>
          </div>
          <div class="border d-flex">
            <div class="w-50 p-2 bg-danger text-white">
              <strong>Power</strong>
            </div>
            <span id="${this.ids.movePower}" class="w-50 m-2">
            </span>
          </div>
          <div class="border d-flex">
            <div class="w-50 p-2 bg-danger text-white">
              <strong>Accuracy</strong>
            </div>
            <span id="${this.ids.moveAccuracy}" class="w-50 m-2">
            </span>
          </div>
          <div class="border d-flex">
            <div class="w-50 p-2 bg-danger text-white">
              <strong>Type</strong>
            </div>
            <span id="${this.ids.moveType}" class="w-50 m-2">
            </span>
          </div>
          <div class="border d-flex">
            <div class="w-50 p-2 bg-danger text-white">
              <strong>PP</strong>
            </div>
            <span id="${this.ids.movePP}" class="w-50 m-2">
            </span>
          </div>
          <div class="border d-flex">
            <div class="w-50 p-2 bg-danger text-white">
              <strong>Effect Chance</strong>
            </div>
            <span id="${this.ids.moveEffectChance}" class="w-50 m-2">
            </span>
          </div>
          <div class="border d-flex">
            <div class="w-50 p-2 bg-danger text-white">
              <strong>Target</strong>
            </div>
            <span id="${this.ids.moveTarget}" class="w-50 m-2">
            </span>
          </div>
          <div class="border d-flex">
            <div class="w-50 p-2 bg-danger text-white">
              <strong>Introduced</strong>
            </div>
            <span id="${this.ids.moveIntroduced}" class="w-50 m-2">
            </span>
          </div>
        </div>
        <div
          id="${this.ids.effectContainer}"
          class="bg-light py-1 px-2 mt-2 mb-5 border"
        >
          <small class="text-muted">Effect</small>
          <p id="${this.ids.effectEntry}" class="text-primary">
          </p>
        </div>
      </div>
    </div>
    `;
  }

  get() {
    return this.row;
  }

  update() {
    const move = moveState.getMove();
    const categoryIcon = {
      status: '<i class="text-muted fas fa-adjust fa-lg"></i>',
      physical: '<i class="text-muted fas fa-fist-raised fa-lg"></i>',
      special: '<i class="text-muted fas fa-hat-wizard fa-lg"></i>',
    };

    // Move name.
    document.getElementById(this.ids.moveName).textContent = move.name;

    // Description
    const description = move.flavor_text_entries.find(
      (item) =>
        item.language.name === 'en' && item.version_group.name === GAME_VERSION
    );
    document.getElementById(this.ids.moveDescription).textContent =
      description.flavor_text;

    // Move Category
    document.getElementById(this.ids.moveCategory).innerHTML =
      categoryIcon[move.damage_class.name];

    // Move Power
    document.getElementById(this.ids.movePower).textContent =
      move.power || '---';

    // Move Accuracy
    document.getElementById(this.ids.moveAccuracy).textContent =
      move.accuracy || '---';

    // Move Type
    document.getElementById(this.ids.moveType).innerHTML = `
      <small class="type-${move.type.name}">${capitalize(
      move.type.name
    )}</small>
    `;

    // Move PP
    document.getElementById(this.ids.movePP).textContent = move.pp;

    // Effect Chance
    document.getElementById(this.ids.moveEffectChance).textContent =
      move.effect_chance || '---';

    // Move Target
    const moveTarget = capitalize(move.target.name.replace('-', ' '));
    document.getElementById(this.ids.moveTarget).textContent = moveTarget;

    // Generation
    document.getElementById(this.ids.moveIntroduced).textContent = `
      Generation ${move.generation.name.split('-')[1].toUpperCase()}
    `;

    // Move Effect Entry
    const moveEffectEntry =
      move.effect_entries.find((entry) => entry.language.name === 'en')
        .effect || '...';

    document.getElementById(
      this.ids.effectEntry
    ).textContent = moveEffectEntry.replace(
      '$effect_chance',
      move.effect_chance
    );
  }
}
