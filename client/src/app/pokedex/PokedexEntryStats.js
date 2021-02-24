import { pokedexState } from './PokedexState';

export default class PokedexEntryStats {
  constructor() {
    this.card = document.createElement('div');
    this.card.classList = 'card';

    // Card Header.
    const header = document.createElement('div');
    this.card.append(header);
    header.classList = 'card-header bg-danger text-white';
    header.innerHTML = `
    <h5>
      <a
        href="#stats"
        data-parent="#detailsAccordion"
        data-toggle="collapse"
      >
        Stats
      </a>
    </h5>
  `;

    // Card body.
    const statsCollapse = document.createElement('div');
    this.card.append(statsCollapse);
    statsCollapse.classList = 'collapse';
    statsCollapse.id = 'stats';

    this.statsBody = document.createElement('div');
    statsCollapse.append(this.statsBody);
    this.statsBody.classList = 'card-body';

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

  getComponent() {
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
    this.statsBody.innerHTML = content;
  }
}
