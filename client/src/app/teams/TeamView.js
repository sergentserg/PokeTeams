import { teamState } from './TeamState';
import TeamForm from './TeamForm';
import TeamSelect from './TeamSelect';
import MemberAddInput from './MemberAddInput';
import TeamMembers from './TeamMembers';
import { gAlert } from '../../shared/components/Alert';
import MemberEdit from './MemberEdit';
import { pokedexState } from '../pokedex/PokedexState';

export default class TeamsView {
  constructor(main) {
    this.main = main;
    this.main.id = 'teams';

    // Team Create Button.
    this.addTeamBtn = document.createElement('button');
    this.addTeamBtn.classList = 'btn btn-success mb-2 d-block';
    this.addTeamBtn.innerHTML = `<i class="fas fa-plus"></i> Create Team`;

    this.teamAddForm = new TeamForm();
    // Team Add Hide Button.
    this.hideTeamAddBtn = document.createElement('button');
    this.hideTeamAddBtn.classList = 'btn btn-secondary mb-2';
    this.hideTeamAddBtn.innerHTML = `<i class="fas fa-times-circle"></i> Cancel`;

    this.teamSelect = new TeamSelect(this);

    // Team Remove Button
    this.removeTeamBtn = document.createElement('button');
    this.removeTeamBtn.classList = 'btn btn-danger my-2 d-block';
    this.removeTeamBtn.innerHTML = `<i class="fas fa-trash"></i> Remove Team`;

    this.teamEditForm = new TeamForm();
    this.teamMembers = new TeamMembers();
    this.memberAddInput = new MemberAddInput();
    this.memberEdit = new MemberEdit();

    // Stop editting member.
    this.hideMemberEditBtn = document.createElement('button');
    this.hideMemberEditBtn.classList = 'btn btn-secondary mr-2';
    this.hideMemberEditBtn.innerHTML = `<i class="fas fa-times-circle"></i> Cancel`;

    // Save member edits.
    this.saveMemberEditBtn = document.createElement('button');
    this.saveMemberEditBtn.classList = 'btn btn-primary mr-2';
    this.saveMemberEditBtn.innerHTML = `<i class="fas fa-save"></i> Save`;

    this.loadAllEventListeners();
  }

  loadAllEventListeners() {
    this.addTeamBtn.addEventListener('click', this.showTeamCreate.bind(this));
    this.teamAddForm
      .get()
      .addEventListener('submit', this.teamFormSubmit.bind(this));
    this.hideTeamAddBtn.addEventListener('click', this.render.bind(this));
    this.teamSelect.get().addEventListener('change', this.showTeam.bind(this));
    this.removeTeamBtn.addEventListener('click', this.removeTeam.bind(this));
    this.teamMembers
      .get()
      .querySelector('#teamEditBtn')
      .addEventListener('click', this.showTeamEdit.bind(this));
    this.teamEditForm
      .get()
      .addEventListener('submit', this.teamFormSubmit.bind(this));
    this.memberAddInput.ul.addEventListener('click', this.addMember.bind(this));
    this.teamMembers
      .get()
      .querySelector('#pokeTeam')
      .addEventListener('click', this.editOrRemoveMember.bind(this));
    this.hideMemberEditBtn.addEventListener('click', this.showTeam.bind(this));
    this.saveMemberEditBtn.addEventListener(
      'click',
      this.updateMember.bind(this)
    );
  }

  render() {
    while (this.main.firstElementChild) {
      this.main.firstElementChild.remove();
    }
    teamState.setTeam(null);
    // View title.
    const title = document.createElement('h2');
    title.classList = 'mb-2';
    title.textContent = 'Teams';
    this.main.append(title);

    this.main.append(this.addTeamBtn);

    // Team Select input.
    this.teamSelect.update();
    this.main.append(this.teamSelect.get());
  }

  clear() {
    gAlert.get().remove();
    while (this.main.childElementCount > 1) this.main.lastElementChild.remove();
  }

  showTeamCreate() {
    this.clear();
    this.main.append(this.hideTeamAddBtn);
    this.main.append(this.teamAddForm.get());
  }

  showTeamEdit() {
    this.clear();
    this.main.append(this.hideTeamAddBtn);
    this.main.append(this.teamEditForm.get());
  }

  async teamFormSubmit(e) {
    e.preventDefault();
    // Get form data.
    const form = e.target;
    const fields = {
      name: form.elements['teamName'].value,
    };
    form.reset();

    // Verify team name is unique.
    const teams = teamState.getTeams();
    if (teams.some((team) => team.name === fields.name)) {
      gAlert.update(false, 'Duplicate team name');
      this.main.insertBefore(gAlert.get(), this.main.firstElementChild);
      return;
    }

    // Determine if trying to create or edit.
    let data, alertMsg;
    if (e.target === this.teamAddForm.get()) {
      data = await teamState.createTeam(fields);
      alertMsg = data.success ? 'Team created' : 'Unable to create team';
    } else if (e.target === this.teamEditForm.get()) {
      data = await teamState.updateTeam(fields);
      alertMsg = data.success ? 'Team edited' : 'Unable to edit team';
    }
    gAlert.update(data.success, alertMsg);
    // Show default team view page.
    if (data.success) {
      this.render();
    }
    this.main.insertBefore(gAlert.get(), this.main.firstElementChild);
  }

  showTeam(e) {
    // Set current team.
    if (e && e.target === this.teamSelect.get()) {
      teamState.setTeam(e.target.value);
    } else if (e && e.target === this.hideMemberEditBtn) {
      this.memberEdit.update();
    }

    this.clear();
    this.main.append(this.addTeamBtn);
    this.main.append(this.removeTeamBtn);
    this.main.append(this.teamSelect.get());

    // Render current team.
    this.teamMembers.update();
    this.main.append(this.teamMembers.get());

    // Add Team Member button (if less than 6 members).
    if (teamState.getTeam().pokemons.length < 6) {
      this.memberAddInput.update();
      this.main.append(this.memberAddInput.get());
    }
  }

  async removeTeam(e) {
    const teamName = teamState.getTeam().name;
    const data = await teamState.removeTeam();

    // Check if successful removal.
    let alertMsg = `Unable to remove team ${teamName}`;
    if (data.success) {
      alertMsg = `Team ${teamName} removed!`;
      this.render();
    }
    gAlert.update(data.success, alertMsg);
    this.main.insertBefore(gAlert.get(), this.main.firstElementChild);
  }

  async addMember(e) {
    // Hide suggestions list.
    this.memberAddInput.ul.classList.add('d-none');

    // Save the required member fields.
    const dexID = e.target.getAttribute('data-dexID');
    const name = e.target.textContent;
    const fields = { name, dexID };

    // Attempt to add the Pokemon.
    const data = await teamState.addMember(fields);

    // Check if add was successful.
    let alertMsg = 'Unable to add Pokemon';
    if (data.success) {
      alertMsg = `${name} added to ${teamState.getTeam().name}`;
    }

    // Render the team with its (possibly new) members.
    this.showTeam();
    gAlert.update(data.success, alertMsg);
    this.main.insertBefore(gAlert.get(), this.main.firstElementChild);
  }

  async editOrRemoveMember(e) {
    // Check if attempting to edit.
    let btn =
      e.target.closest('.member-edit') || e.target.closest('.member-remove');
    if (!btn) return;

    const memberID = btn.getAttribute('data-memberID');
    teamState.setMember(memberID);
    // Case 1: member edit view.
    if (btn.classList.contains('member-edit')) {
      this.clear();
      this.main.append(this.hideMemberEditBtn);
      this.main.append(this.saveMemberEditBtn);
      // Render edit form and entry.
      const dexID = teamState.getMember().dexID;
      await pokedexState.setPokemon(dexID);
      this.memberEdit.update();
      this.main.append(this.memberEdit.get());
    }
    // Case 2: attempt to remove member.
    else if (btn.classList.contains('member-remove')) {
      const data = await teamState.removeMember(memberID);
      let alertMsg = 'Unable to remove member';
      if (data.success) {
        this.showTeam();
        alertMsg = 'Member removed successfully';
      }
      gAlert.update(data.success, alertMsg);
      this.main.insertBefore(gAlert.get(), this.main.firstElementChild);
    }
  }

  async updateMember(e) {
    // Get the fields.
    const form = this.memberEdit.get().querySelector('form');
    const moveInputs = form.querySelector('#chosenMoves').children;
    let moves = [];
    Array.from(moveInputs).forEach((input) => {
      moves.push(input.getAttribute('value'));
    });
    const member = teamState.getMember();
    const fields = {
      pokemon: member.name,
      dexID: member.dexID,
      nick: form.elements['nick'].value,
      item: form.elements['itemName'].textContent,
      moves,
    };

    // Update the team member.
    const data = await teamState.updateMember(fields);
    if (data.success) {
      gAlert.update(true, 'Team Member updated!');
      this.showTeam();
    } else {
      gAlert.update(false, 'Unable to update member');
    }
    this.main.insertBefore(gAlert.get(), this.main.firstElementChild);
  }
}
