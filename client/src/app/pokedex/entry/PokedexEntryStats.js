import PokedexEntryInfo from './PokedexEntryInfo';
import { pokedexState } from '../PokedexState';

export default class PokedexEntryStats extends PokedexEntryInfo {
  constructor() {
    super('Stats', 'stats');
    // Options for stats bars.
    this.statsOpts = [
      { title: 'HP', class: 'stat-hp', icon: 'fa-heart' },
      { title: 'Attack', class: 'stat-atk', icon: 'fa-fist-raised' },
      { title: 'Defense', class: 'stat-def', icon: 'fa-shield-alt' },
      { title: 'Sp. Atk', class: 'stat-spatk', icon: 'fa-meteor' },
      { title: 'Sp. Def', class: 'stat-spdef', icon: 'fa-shield-virus' },
      { title: 'Speed', class: 'stat-spd', icon: 'fa-feather' },
    ];
  }

  get() {
    return this.card;
  }

  update() {
    const stats = pokedexState.getPokemon().stats;
    let content = '';
    for (let i = 0; i < stats.length; i++) {
      content += `
      <i class="fas ${this.statsOpts[i].icon}"></i>
      <strong> ${this.statsOpts[i].title}: </strong>
      <div class="progress mb-2">
        <div
          style="width:${(100 * stats[i].base_stat) / 255}%"
          class="progress-bar progress-bar-striped progress-bar-animated ${
            this.statsOpts[i].class
          }"
          role="progressbar"
          aria-valuenow="${stats[i].base_stat}"
          aria-valuemin="1"
          aria-valuemax="255"
        >
          ${stats[i].base_stat}
        </div>
      </div>
    `;
    }
    this.cardBody.innerHTML = content;
  }
}
