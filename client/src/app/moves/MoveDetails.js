import { GAME_VERSION } from 'src/shared/util/constants';
import { capitalize } from 'src/shared/util/capitalize';
import { moveState } from './MoveState';

export default class MoveDetails {
  constructor() {
    this.container = document.createElement('div');
    this.container.classList = 'row';

    this.col = document.createElement('col');
    this.col.classList = 'col-md-4';
    this.container.append(this.col);

    // Name
    this.name = document.createElement('h2');
    this.name.classList = 'text-secondary mb-3';
    this.col.append(this.name);

    // Description
    const descriptionArea = document.createElement('div');
    descriptionArea.classList = 'bg-light p-2 mb-2 border';
    this.col.append(descriptionArea);

    const small = document.createElement('small');
    small.classList = 'text-muted';
    small.textContent = 'Description';
    descriptionArea.append(small);

    this.description = document.createElement('p');
    descriptionArea.append(this.description);

    // Stats table.
    this.statsTable = document.createElement('div');
    this.statsTable.classList = 'text-center';
    this.col.append(this.statsTable);

    this.category = this.makeTableRow('Category');
    this.power = this.makeTableRow('Power');
    this.accuracy = this.makeTableRow('Accuracy');

    const typeRow = this.makeTableRow('Type');
    this.type = document.createElement('small');
    typeRow.append(this.type);

    this.pp = this.makeTableRow('PP');
    this.effectChance = this.makeTableRow('Effect Chance');
    this.target = this.makeTableRow('Target');
    this.introduced = this.makeTableRow('Introduced');

    // Effect name and description.
    const effectArea = document.createElement('div');
    effectArea.classList = 'bg-light py-1 px-2 mt-2 mb-5 border';
    this.col.append(effectArea);

    const effectTitle = document.createElement('small');
    effectTitle.classList = 'text-muted';
    effectTitle.textContent = 'Effect';
    effectArea.append(effectTitle);

    this.effectEntry = document.createElement('p');
    this.effectEntry.classList = 'text-primary';
    effectArea.append(this.effectEntry);
  }

  get() {
    return this.container;
  }

  static categoryIcon(category) {
    if (category === 'status') {
      return '<i class="text-muted fas fa-adjust fa-lg"></i>';
    } else if (category === 'physical') {
      return '<i class="text-muted fas fa-fist-raised fa-lg"></i>';
    } else if (category === 'special') {
      return '<i class="text-muted fas fa-fist-raised fa-lg"></i>';
    }
  }

  update() {
    const move = moveState.getMove();

    // Move name.
    this.name.textContent = move.name;

    // Description
    const description = move.flavor_text_entries.find(
      (item) =>
        item.language.name === 'en' && item.version_group.name === GAME_VERSION
    );
    this.description.textContent = description.flavor_text;

    // Move Category
    this.category.innerHTML = MoveDetails.categoryIcon(move.damage_class.name);

    // Move Power
    this.power.textContent = move.power || '---';

    // Move Accuracy
    this.accuracy.textContent = move.accuracy || '---';

    // Move Type
    this.type.classList = `type-${move.type.name}`;
    this.type.textContent = `${capitalize(move.type.name)}`;

    // Move PP
    this.pp.textContent = move.pp;

    // Effect Chance
    this.effectChance.textContent = move.effect_chance || '---';

    // Move Target
    this.target.textContent = capitalize(move.target.name.replace('-', ' '));

    // Generation
    this.introduced = `
      Generation ${move.generation.name.split('-')[1].toUpperCase()}
    `;

    // Move Effect Entry
    const entry =
      move.effect_entries.find((entry) => entry.language.name === 'en')
        .effect || '...';

    this.effectEntry.textContent = entry.replace(
      '$effect_chance',
      move.effect_chance
    );
  }

  makeTableRow(title) {
    const tableRow = document.createElement('div');
    tableRow.classList = 'border d-flex';

    const tableHeader = document.createElement('div');
    tableHeader.classList = 'w-50 p-2 bg-danger text-white';
    tableHeader.innerHTML = `<strong>${title}</strong>`;
    tableRow.append(tableHeader);

    const span = document.createElement('span');
    span.classList = 'm-2 w-50';
    tableRow.append(span);
    this.statsTable.append(tableRow);
    return span;
  }
}
