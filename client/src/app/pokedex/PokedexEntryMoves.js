import { capitalize } from 'src/shared/util/capitalize';

export default function PokedexEntryMoves(moves) {
  // Save a private reference to moves.
  const movesCard = document.createElement('div');
  movesCard.classList = 'card';

  const header = document.createElement('div');
  header.classList = 'card-header bg-danger text-white';
  header.innerHTML = `
    <h5>
      <a
        href="#movesAccord"
        data-parent="#detailsAccordion"
        data-toggle="collapse"
      >
        <i class="fas fa-angle-right"></i> Moves
      </a>
    </h5>
  `;
  movesCard.append(header);

  const movesCollapse = document.createElement('div');
  movesCollapse.classList = 'collapse';
  movesCollapse.id = 'movesAccord';
  movesCard.append(movesCollapse);

  const movesCardBody = document.createElement('div');
  movesCardBody.classList = 'card-body';
  movesCollapse.append(movesCardBody);

  const levelBtn = document.createElement('button');
  levelBtn.classList = 'btn p-1 border';
  levelBtn.id = 'levelUp';
  levelBtn.innerHTML = `
    <span>
      <i class="fas fa-chart-line text-success"></i>
      <small class="text-muted">Lv. Up</small>
    </span>
  `;
  movesCardBody.append(levelBtn);

  const eggBtn = document.createElement('button');
  eggBtn.classList = 'btn p-1 border';
  eggBtn.id = 'egg';
  eggBtn.innerHTML = `
    <span>
      <i class="fas fa-egg text-warning"></i>
      <small class="text-muted">Egg</small>
    </span>
  `;
  movesCardBody.append(eggBtn);

  const machineBtn = document.createElement('button');
  machineBtn.classList = 'btn p-1 border';
  machineBtn.id = 'machine';
  machineBtn.innerHTML = `
    <span>
      <i class="fas fa-compact-disc text-secondary"></i>
      <small class="text-muted">Machine</small>
    </span>
  `;
  movesCardBody.append(machineBtn);

  const shownMoves = document.createElement('div');
  shownMoves.classList = 'p-3 mt-2 border rounded';
  movesCardBody.append(shownMoves);
  // <div id="moveNames" class="p-3 mt-2 border rounded"></div>

  [levelBtn, eggBtn, machineBtn].forEach((btn) =>
    btn.addEventListener('click', (e) => {
      const method = e.target.closest('.btn').id;
      const currentMoveFilter = document.querySelector('.move-filter');
      if (currentMoveFilter && currentMoveFilter.id != method) {
        document.querySelector('.move-filter').classList.remove('move-filter');
      }
      document.querySelector(`#${method}`).classList.add('move-filter');

      // Update shown moves.
      while (shownMoves.firstElementChild)
        shownMoves.firstElementChild.remove();

      let movesContent = '';
      moves[method].forEach((move) => {
        const level = move.level
          ? `<span class="text-success">Lv. ${move.level}</span> `
          : '';
        movesContent += `
        <a class="btn text-primary bg-light border rounded p-1 mb-1 mr-1">
          <small>${level}${capitalize(move.name)}
          </small>
        </a>
      `;
      });
      shownMoves.innerHTML = movesContent;
    })
  );

  return movesCard;
}
