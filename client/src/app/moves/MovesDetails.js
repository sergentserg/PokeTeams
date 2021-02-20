import { GAME_VERSION } from 'src/shared/util/constants';
import { capitalize } from 'src/shared/util/capitalize';

export default (function MovesDetails() {
  const row = document.createElement('div');
  row.classList = 'row';

  const ids = {
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

  row.innerHTML = `
    <div id="moveDetails" class="col-md-4">
      <h2 id="${ids.moveName}" class="text-secondary mb-3"></h2>
      <div class="bg-light p-2 mb-2 border">
        <small class="text-muted">Description</small>
        <p id="${ids.moveDescription}">
        </p>
      </div>

      <div id="moveStats" class="text-center">
        <div class="border d-flex">
          <div class="w-50 p-2 bg-danger text-white">
            <strong>Category</strong>
          </div>
          <span id="${ids.moveCategory}" class="m-2 w-50">
          </span>
        </div>
        <div class="border d-flex">
          <div class="w-50 p-2 bg-danger text-white">
            <strong>Power</strong>
          </div>
          <span id="${ids.movePower}" class="w-50 m-2">
          </span>
        </div>
        <div class="border d-flex">
          <div class="w-50 p-2 bg-danger text-white">
            <strong>Accuracy</strong>
          </div>
          <span id="${ids.moveAccuracy}" class="w-50 m-2">
          </span>
        </div>
        <div class="border d-flex">
          <div class="w-50 p-2 bg-danger text-white">
            <strong>Type</strong>
          </div>
          <span id="${ids.moveType}" class="w-50 m-2">
          </span>
        </div>
        <div class="border d-flex">
          <div class="w-50 p-2 bg-danger text-white">
            <strong>PP</strong>
          </div>
          <span id="${ids.movePP}" class="w-50 m-2">
          </span>
        </div>
        <div class="border d-flex">
          <div class="w-50 p-2 bg-danger text-white">
            <strong>Effect Chance</strong>
          </div>
          <span id="${ids.moveEffectChance}" class="w-50 m-2">
          </span>
        </div>
        <div class="border d-flex">
          <div class="w-50 p-2 bg-danger text-white">
            <strong>Target</strong>
          </div>
          <span id="${ids.moveTarget}" class="w-50 m-2">
          </span>
        </div>
        <div class="border d-flex">
          <div class="w-50 p-2 bg-danger text-white">
            <strong>Introduced</strong>
          </div>
          <span id="${ids.moveIntroduced}" class="w-50 m-2">
          </span>
        </div>
      </div>
      <div
        id="${ids.effectContainer}"
        class="bg-light py-1 px-2 mt-2 mb-5 border"
      >
        <small class="text-muted">Effect</small>
        <p id="${ids.effectEntry}" class="text-primary">
        </p>
      </div>
    </div>
  </div>
  `;

  return {
    component: row,
    update: function (move) {
      const categoryIcon = {
        status: '<i class="text-muted fas fa-adjust fa-lg"></i>',
        physical: '<i class="text-muted fas fa-fist-raised fa-lg"></i>',
        special: '<i class="text-muted fas fa-hat-wizard fa-lg"></i>',
      };

      // Move name.
      document.getElementById(ids.moveName).textContent = move.name;

      // Description
      const description = move.flavor_text_entries.find(
        (item) =>
          item.language.name === 'en' &&
          item.version_group.name === GAME_VERSION
      );
      document.getElementById(ids.moveDescription).textContent =
        description.flavor_text;

      // Move Category
      document.getElementById(ids.moveCategory).innerHTML =
        categoryIcon[move.damage_class.name];

      // Move Power
      document.getElementById(ids.movePower).textContent = move.power || '---';

      // Move Accuracy
      document.getElementById(ids.moveAccuracy).textContent =
        move.accuracy || '---';

      // Move Type
      document.getElementById(ids.moveType).innerHTML = `
        <small class="type-${move.type.name}">${capitalize(
        move.type.name
      )}</small>
      `;

      // Move PP
      document.getElementById(ids.movePP).textContent = move.pp;

      // Effect Chance
      document.getElementById(ids.moveEffectChance).textContent =
        move.effect_chance || '---';

      // Move Target
      const moveTarget = capitalize(move.target.name.replace('-', ' '));
      document.getElementById(ids.moveTarget).textContent = moveTarget;

      // Generation
      document.getElementById(ids.moveIntroduced).textContent = `
        Generation ${move.generation.name.split('-')[1].toUpperCase()}
      `;

      // Move Effect Entry
      const moveEffectEntry =
        move.effect_entries.find((entry) => entry.language.name === 'en')
          .effect || '...';

      document.getElementById(
        ids.effectEntry
      ).textContent = moveEffectEntry.replace(
        '$effect_chance',
        move.effect_chance
      );
    },
  };
})();
