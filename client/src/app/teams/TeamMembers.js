import { teamState } from './TeamState';
import { POKE_SPRITE_URL } from 'src/shared/util/constants';

export default class TeamMembers {
  constructor() {
    this.container = document.createElement('div');

    // Team name edit: wrap, name, and button.
    this.nameEdit = document.createElement('div');
    this.nameEdit.classList = 'd-flex justify-content-center m-2';
    this.container.append(this.nameEdit);

    this.name = document.createElement('h3');
    this.nameEdit.append(this.name);

    const editBtn = document.createElement('button');
    editBtn.id = 'teamEditBtn';
    editBtn.classList = 'btn btn-warning mx-2';
    editBtn.innerHTML = ` <i class="fas fa-edit"></i>`;
    this.nameEdit.append(editBtn);

    // Team
    this.members = document.createElement('div');
    this.members.id = 'pokeTeam';
    this.container.append(this.members);
  }

  get() {
    return this.container;
  }

  update() {
    const team = teamState.getTeam();
    // Team name.

    this.name.textContent = team.name;
    // Clear team component.
    while (this.members.firstElementChild)
      this.members.firstElementChild.remove();

    team.pokemons.forEach((member) => {
      const memberWrap = document.createElement('div');
      this.members.append(memberWrap);
      memberWrap.classList = 'team-member';

      const imgWrap = document.createElement('div');
      imgWrap.innerHTML = `<img src="${POKE_SPRITE_URL}/${member.dexID}.png" alt=$"${member.name}"/>`;
      memberWrap.append(imgWrap);

      // Pokemon Nickname.
      const name = document.createElement('strong');
      name.classList = 'mb-1';
      name.textContent = `${member.nick || member.name}`;
      memberWrap.append(name);

      const buttons = document.createElement('div');
      buttons.classList = 'd-flex justify-content-center';
      memberWrap.append(buttons);

      // Edit member button.
      const editBtn = document.createElement('button');
      editBtn.classList = `btn btn-warning mr-2 member-edit`;
      editBtn.innerHTML = `<i class="fas fa-edit"></i>`;
      editBtn.setAttribute('data-memberID', `${member._id}`);
      buttons.append(editBtn);

      // Remove member button.
      const removeBtn = document.createElement('button');
      removeBtn.classList = `btn btn-danger member-remove`;
      removeBtn.innerHTML = `<i class="fas fa-trash"></i>`;
      removeBtn.setAttribute('data-memberID', `${member._id}`);
      buttons.append(removeBtn);
    });
  }
}
