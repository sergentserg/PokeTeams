import ItemSearch from './ItemSearch';
import { itemState } from './ItemState';
import { teamState } from './TeamState';

export default class MemberForm {
  constructor() {
    this.member = null;
    this.form = document.createElement('form');
    this.form.id = 'currentTeamMember';
    this.form.classList = 'm-2';

    // Nickname Group: label and input.
    let formGroup = document.createElement('div');
    formGroup.classList = 'form-group';
    this.form.append(formGroup);

    const nickLabel = document.createElement('label');
    nickLabel.classList = 'mr-2';
    nickLabel.setAttribute('for', 'nick');
    nickLabel.textContent = 'Nickname';
    formGroup.append(nickLabel);

    const nickInput = document.createElement('input');
    nickInput.setAttribute('type', 'text');
    nickInput.setAttribute('name', 'nick');
    nickInput.classList = 'form-control mr-2';
    formGroup.append(nickInput);

    // Item Group: label and input.
    this.itemSearch = new ItemSearch();
    this.itemSearch.ul.addEventListener('click', this.showItem.bind(this));
    this.form.append(this.itemSearch.get());

    this.itemDesc = document.createElement('div');
    this.itemDesc.classList = 'info-bubble d-none';
    this.form.append(this.itemDesc);

    // Move inputs
    formGroup = document.createElement('div');
    formGroup.classList = 'form-group';
    this.form.append(formGroup);

    const moveLabel = document.createElement('label');
    moveLabel.classList = 'mr-2';
    moveLabel.setAttribute('for', 'moves');
    moveLabel.textContent = 'Moves';
    formGroup.append(moveLabel);

    this.moveInputs = document.createElement('div');
    this.moveInputs.id = 'chosenMoves';
    formGroup.append(this.moveInputs);

    // <h4>Move Set <i class="fas fa-compact-disc"></i></h4>
  }

  getComponent() {
    return this.form;
  }

  update() {
    // Populate form.
    const member = teamState.getMember();
    this.form.elements['nick'].value = member.nick || member.name;
    this.form.elements['itemName'].value = member.item || '';
    if (member.item) {
      this.showItemDescription(member.item);
    }
    // this.itemSearch.getComponent().querySelector('input').value =
    //   member.item || '';
    // Populate move inputs.
    Array.from(this.moveInputs.children).forEach((input) => input.remove());
    const moves = member.moves || [];
    moves.forEach((move) => this.toggleMove(move));
  }

  showItem(e) {
    const ul = e.target.parentElement;
    ul.classList.add('d-none');
    const itemName = e.target.textContent;
    this.showItemDescription(itemName);
  }

  async showItemDescription(itemName) {
    // Populate search input with item name.
    const itemInput = this.itemSearch.search;
    itemInput.textContent = `${itemName}`;
    itemInput.value = `${itemName}`;

    // Show item description bubble.
    this.itemDesc.classList.add('d-none');
    const item = await itemState.getItem(itemName.toLowerCase());
    const effect = item.effect_entries.find(
      (entry) => entry.language.name === 'en'
    ).effect;

    this.itemDesc.classList.remove('d-none');
    this.itemDesc.innerHTML = `
    <div>
      <img
        src="${item.sprites.default}"
        alt="${itemName}"
      />
      <strong>${itemName}</strong>
    </div>
    <p class="text-muted">
      ${effect}
    </p>
    `;
  }

  toggleMove(move) {
    let input = Array.from(this.moveInputs.children).find(
      (e) => e.getAttribute('value') === move
    );

    if (input) {
      input.remove();
      return true;
    } else if (this.moveInputs.childElementCount === 4) {
      return false;
    } else {
      input = document.createElement('input');
      input.classList = 'form-control m-2';
      input.setAttribute('value', `${move}`);
      input.setAttribute('type', 'text');
      input.setAttribute('disabled', '');
      this.moveInputs.append(input);
      return true;
    }
  }
}
