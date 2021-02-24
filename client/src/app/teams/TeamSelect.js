import { teamState } from './TeamState';

export default class TeamSelect {
  constructor() {
    this.select = document.createElement('select');
    this.select.classList = 'form-control mb-2';
    this.select.setAttribute('name', 'teamSelect');

    let option = document.createElement('option');
    option.setAttribute('selected', '');
    option.setAttribute('disabled', '');
    option.setAttribute('hidden', '');
    option.textContent = 'Choose Team';
    this.select.append(option);
  }

  getComponent() {
    return this.select;
  }

  update() {
    while (this.select.childElementCount > 1)
      this.select.lastElementChild.remove();
    this.select.selectedIndex = 0;

    const teams = teamState.getTeams();
    teams.forEach((team) => {
      const option = document.createElement('option');
      option.setAttribute('value', `${team._id}`);
      option.textContent = `${team.name}`;
      this.select.append(option);
    });
  }
}
