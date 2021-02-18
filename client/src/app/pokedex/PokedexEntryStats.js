export default function PokedexEntryStats(stats) {
  const statsCard = document.createElement('div');
  statsCard.classList = 'card';

  const header = document.createElement('div');
  header.classList = 'card-header bg-danger text-white';
  header.innerHTML = `
    <h5>
      <a
        href="#stats"
        data-parent="#detailsAccordion"
        data-toggle="collapse"
      >
        <i class="fas fa-angle-right"></i> Stats
      </a>
    </h5>
  `;
  statsCard.append(header);

  const statsCollapse = document.createElement('div');
  statsCollapse.classList = 'collapse';
  statsCollapse.id = 'stats';
  statsCard.append(statsCollapse);

  const statsBody = document.createElement('div');
  statsBody.classList = 'card-body';

  const statsOpts = [
    { title: 'HP', class: 'stat-hp', icon: 'fa-heart' },
    { title: 'Attack', class: 'stat-atk', icon: 'fa-fist-raised' },
    { title: 'Defense', class: 'stat-def', icon: 'fa-shield-alt' },
    { title: 'Sp. Atk', class: 'stat-spatk', icon: 'fa-meteor' },
    { title: 'Sp. Def', class: 'stat-spdef', icon: 'fa-shield-virus' },
    { title: 'Speed', class: 'stat-spd', icon: 'fa-feather' },
  ];
  let content = '';
  for (let i = 0; i < stats.length; i++) {
    content += `
      <i class="fas ${statsOpts[i].icon}"></i>
      <strong> ${statsOpts[i].title}: </strong>
      <div class="progress mb-2">
        <div
          style="width:${(100 * stats[i].base_stat) / 255}%"
          class="progress-bar progress-bar-striped progress-bar-animated ${
            statsOpts[i].class
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
  statsBody.innerHTML = content;
  statsCollapse.append(statsBody);
  return statsCard;
}
