import { teamState } from './TeamState';
import TeamAddForm from './TeamAddForm';
import TeamSelect from './TeamSelect';
import MemberAddInput from './MemberAddInput';
import TeamMembers from './TeamMembers';
import { Alert } from 'src/shared/components/Alert';
import MemberEdit from './MemberEdit';
import { pokedexState } from '../pokedex/PokedexState';

export default class TeamsView {
  constructor(main) {
    this.main = main;
    this.main.id = 'teams';

    this.alert = null;

    // Team Create.
    this.teamAddForm = new TeamAddForm();
    this.teamAddForm
      .getComponent()
      .addEventListener('submit', this.addTeam.bind(this));

    // Team Create Button.
    this.addTeamBtn = document.createElement('button');
    this.addTeamBtn.classList = 'btn btn-success mb-2 d-block';
    this.addTeamBtn.innerHTML = `<i class="fas fa-plus"></i> Create Team`;
    this.addTeamBtn.addEventListener('click', this.showTeamCreate.bind(this));

    // Team Add Hide Button.
    this.hideTeamAddBtn = document.createElement('button');
    this.hideTeamAddBtn.classList = 'btn btn-secondary mb-2';
    this.hideTeamAddBtn.innerHTML = `<i class="fas fa-times-circle"></i> Cancel`;
    this.hideTeamAddBtn.addEventListener('click', this.render.bind(this));

    // Team Select
    this.teamSelect = new TeamSelect(this);
    this.teamSelect
      .getComponent()
      .addEventListener('change', this.showTeam.bind(this));

    // Team Remove Button
    this.removeTeamBtn = document.createElement('button');
    this.removeTeamBtn.classList = 'btn btn-danger my-2 d-block';
    this.removeTeamBtn.innerHTML = `<i class="fas fa-trash"></i> Remove Team`;
    this.removeTeamBtn.addEventListener('click', this.removeTeam.bind(this));

    // Member add button.
    this.memberAddInput = new MemberAddInput();
    this.memberAddInput.ul.addEventListener('click', this.addMember.bind(this));

    // Team Members.
    this.teamMembers = new TeamMembers();
    this.teamEditForm = new TeamAddForm();
    this.teamEditForm
      .getComponent()
      .addEventListener('submit', this.editTeam.bind(this));
    this.teamMembers
      .getComponent()
      .querySelector('#teamEditBtn')
      .addEventListener('click', this.showTeamEdit.bind(this));
    this.teamMembers
      .getComponent()
      .querySelector('#pokeTeam')
      .addEventListener('click', this.updateOrRemoveMember.bind(this));

    this.memberEdit = new MemberEdit();

    // Cancel btn
    this.hideMemberEditBtn = document.createElement('button');
    this.hideMemberEditBtn.classList = 'btn btn-secondary mr-2';
    this.hideMemberEditBtn.innerHTML = `<i class="fas fa-times-circle"></i> Cancel`;
    this.hideMemberEditBtn.addEventListener('click', this.showTeam.bind(this));

    // Save btn
    this.saveMemberEditBtn = document.createElement('button');
    this.saveMemberEditBtn.classList = 'btn btn-primary mr-2';
    this.saveMemberEditBtn.innerHTML = `<i class="fas fa-save"></i> Save`;
    this.saveMemberEditBtn.addEventListener(
      'click',
      this.updateMember.bind(this)
    );
  }

  clear() {
    if (this.alert) {
      this.alert.remove();
    }
    while (this.main.childElementCount > 1) this.main.lastElementChild.remove();
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
    this.main.append(this.teamSelect.getComponent());
  }

  showTeamCreate() {
    this.clear();
    this.main.append(this.hideTeamAddBtn);
    this.main.append(this.teamAddForm.getComponent());
  }

  async addTeam(e) {
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
      this.alert = Alert(false, 'Duplicate team name');
    } else {
      // Attempt to create a team.
      const data = await teamState.createTeam(fields);
      this.alert = Alert(
        data.success,
        data.success ? 'Team created' : 'Unable to create team'
      );
      if (data.success) {
        // Show default team view page.
        this.render();
      }
    }
    this.main.insertBefore(this.alert, this.main.firstElementChild);
  }

  showTeamEdit() {
    this.clear();
    this.main.append(this.hideTeamAddBtn);
    this.main.append(this.teamEditForm.getComponent());
  }

  async editTeam(e) {
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
      this.alert = Alert(false, 'Duplicate team name');
    } else {
      // Attempt to edit team.
      const data = await teamState.updateTeam(fields);
      this.alert = Alert(
        data.success,
        data.success ? 'Team edited' : 'Unable to edit team'
      );
      if (data.success) {
        // Show default team view page.
        this.render();
      }
    }
    this.main.insertBefore(this.alert, this.main.firstElementChild);
  }

  showTeam(e) {
    // Set current team.
    if (e && e.target === this.teamSelect.getComponent()) {
      const select = e.target;
      const teamId = select.value;
      teamState.setTeam(teamId);
    } else if (e && e.target === this.hideMemberEditBtn) {
      this.memberEdit.update();
    }

    this.clear();
    this.main.append(this.addTeamBtn);
    this.main.append(this.removeTeamBtn);
    this.main.append(this.teamSelect.getComponent());

    // Render current team.
    this.teamMembers.update();
    this.main.append(this.teamMembers.getComponent());

    // Add Team Member.
    if (teamState.getTeam().pokemons.length < 6) {
      this.memberAddInput.update();
      this.main.append(this.memberAddInput.getComponent());
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
    this.alert = Alert(data.success, alertMsg);
    this.main.insertBefore(this.alert, this.main.firstElementChild);
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

    // Render the team with (possibly new) members.
    this.showTeam();
    this.alert = Alert(data.success, alertMsg);
    this.main.insertBefore(this.alert, this.main.firstElementChild);
  }

  async updateOrRemoveMember(e) {
    // Check if attempting to edit.
    let btn =
      e.target.closest('.member-edit') || e.target.closest('.member-remove');
    if (!btn) return;

    const memberID = btn.getAttribute('data-memberID');
    teamState.setMember(memberID);
    // Render edit view or remove a member.
    if (btn.classList.contains('member-edit')) {
      // Clear view.
      this.clear();
      this.main.append(this.hideMemberEditBtn);
      this.main.append(this.saveMemberEditBtn);
      // Render edit form and entry.
      const dexID = teamState.getMember().dexID;
      await pokedexState.setPokemon(dexID);
      this.memberEdit.update();
      this.main.append(this.memberEdit.getComponent());
    } else if (btn.classList.contains('member-remove')) {
      const data = await teamState.removeMember(memberID);
      let alertMsg = 'Unable to remove member';
      if (data.success) {
        this.showTeam();
        alertMsg = 'Member removed successfully';
      }
      this.alert = Alert(data.success, alertMsg);
      this.main.insertBefore(this.alert, this.main.firstElementChild);
    }
  }

  async updateMember(e) {
    // Get the fields.
    const form = this.memberEdit.getComponent().querySelector('form');
    //
    const moveInputs = form.querySelector('#chosenMoves').children;
    let moves = [];
    Array.from(moveInputs).forEach((input) => {
      moves.push(input.getAttribute('value'));
    });
    const member = teamState.getMember();
    Array.from(form.elements).forEach((input) => {
      console.log(input.getAttribute('name'));
    });

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
      this.alert = Alert(true, 'Team Member updated!');
      this.showTeam();
    } else {
      this.alert = Alert(false, 'Unable to update member');
    }
    this.main.insertBefore(this.alert, this.main.firstElementChild);
  }
}
