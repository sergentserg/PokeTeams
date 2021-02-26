import { API_URL } from 'src/shared/util/constants';
import fetchLoad from '../../shared/util/fetchLoad';

class TeamState {
  constructor() {
    this.teams = [];
    this.currentTeam = null;
    this.currentMember = null;
  }

  async init() {
    const res = await fetchLoad(`${API_URL}/teams`, {
      method: 'GET',
      credentials: 'include',
    });
    const data = await res.json();
    this.teams = data.data;
    this.teams.forEach((team) => {
      if (!team.pokemons) {
        team.pokemons = [];
      }
    });
  }

  getTeam() {
    return this.currentTeam;
  }

  getTeams() {
    return this.teams;
  }

  setTeam(teamId) {
    if (teamId) {
      this.currentTeam = this.teams.find((team) => team._id === teamId);
      if (!this.currentTeam.pokemons) {
        this.currentTeam.pokemons = [];
      }
    } else {
      this.currentTeam = null;
    }
  }

  async createTeam(fields) {
    const res = await fetchLoad(`${API_URL}/teams`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(fields),
    });
    const data = await res.json();
    if (data.success) {
      this.teams.push(data.data);
    }
    return data;
  }

  async updateTeam(fields) {
    const teamID = this.currentTeam._id;
    const res = await fetchLoad(`${API_URL}/teams/${teamID}`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(fields),
    });
    const data = await res.json();
    if (data.success) {
      const index = this.teams.indexOf(this.currentTeam);
      this.teams[index] = data.data;
      this.currentTeam = data.data;
    }
    return data;
  }

  async removeTeam() {
    const teamId = this.currentTeam._id;
    const res = await fetchLoad(`${API_URL}/teams/${teamId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    const data = await res.json();
    if (data.success) {
      this.currentTeam = null;
      this.teams = this.teams.filter((team) => team._id !== teamId);
    }
    return data;
  }

  getMember() {
    return this.currentMember;
  }

  setMember(memberID) {
    this.currentMember = this.currentTeam.pokemons.find(
      (pkmn) => pkmn._id === memberID
    );
  }

  async addMember(fields) {
    const res = await fetchLoad(
      `${API_URL}/teams/${this.currentTeam._id}/pokemons`,
      {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(fields),
      }
    );
    const data = await res.json();
    if (data.success) {
      this.currentTeam.pokemons.push(data.data);
    }
    return data;
  }

  async updateMember(fields) {
    const index = this.currentTeam.pokemons.findIndex(
      (member) => member.dexID === fields.dexID
    );
    const memberId = this.currentTeam.pokemons[index]._id;
    const res = await fetchLoad(`${API_URL}/pokemons/${memberId}`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(fields),
    });
    const data = await res.json();
    if (data.success) {
      this.currentTeam.pokemons[index] = data.data;
    }
    return data;
  }

  async removeMember(memberID) {
    const res = await fetchLoad(`${API_URL}/pokemons/${memberID}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    const data = await res.json();
    if (data.success) {
      this.currentTeam.pokemons = this.currentTeam.pokemons.filter(
        (member) => member._id !== memberID
      );
    }
    return data;
  }
}

export const teamState = new TeamState();
