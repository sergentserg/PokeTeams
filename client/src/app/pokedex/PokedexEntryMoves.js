import { capitalize } from 'src/shared/util/capitalize';
import { pokedexState } from './PokedexState';

export default class PokedexEntryMoves {
  constructor() {
    // Save a private reference to moves.
    this.card = document.createElement('div');
    this.card.classList = 'card';

    // Header.
    const header = document.createElement('div');
    this.card.append(header);
    header.classList = 'card-header bg-danger text-white';
    header.innerHTML = `
      <h5>
        <a
          href="#movesAccord"
          data-parent="#detailsAccordion"
          data-toggle="collapse"
        >
          Moves
        </a>
      </h5>
    `;

    // Collapse and body.
    this.collapse = document.createElement('div');
    this.card.append(this.collapse);
    this.collapse.classList = 'collapse';
    this.collapse.id = 'movesAccord';

    this.body = document.createElement('div');
    this.body.classList = 'card-body';
    this.collapse.append(this.body);

    // Level Up Moves Button.
    const levelBtn = document.createElement('button');
    levelBtn.classList = 'btn p-1 border m-1';
    levelBtn.id = 'levelUp';
    levelBtn.innerHTML = `
    <span>
      <i class="fas fa-chart-line text-success"></i>
      <small class="text-muted">Lv. Up</small>
    </span>
  `;
    this.body.append(levelBtn);

    // Egg Moves Button.
    const eggBtn = document.createElement('button');
    eggBtn.classList = 'btn p-1 border m-1';
    eggBtn.id = 'egg';
    eggBtn.innerHTML = `
    <span class="m-1">
      <i class="fas fa-egg text-warning"></i>
      <small class="text-muted">Egg</small>
    </span>
  `;
    this.body.append(eggBtn);

    // Machine Moves Button.
    const machineBtn = document.createElement('button');
    machineBtn.classList = 'btn p-1 border m-1';
    machineBtn.id = 'machine';
    machineBtn.innerHTML = `
    <span>
      <i class="fas fa-compact-disc text-secondary"></i>
      <small class="text-muted">Machine</small>
    </span>
  `;
    this.body.append(machineBtn);

    // Moves for current Pokemon.
    this.moves = null;

    const moveBtns = [levelBtn, eggBtn, machineBtn];
    for (let i = 0; i < moveBtns.length; i++) {
      moveBtns[i].addEventListener('click', this.toggleMoves.bind(this));
    }

    this.shownMoves = document.createElement('div');
    this.shownMoves.id = 'shownMoves';
    this.shownMoves.classList = 'p-3 mt-2 border rounded';
    this.body.append(this.shownMoves);

    this.moveDivs = {
      egg: document.createElement('div'),
      machine: document.createElement('div'),
      levelUp: document.createElement('div'),
    };
    for (const [method, div] of Object.entries(this.moveDivs)) {
      div.classList = 'd-none';
      this.shownMoves.append(div);
    }
  }

  getComponent() {
    return this.card;
  }

  update() {
    this.moves = pokedexState.getPokemon().moves;

    // Update Move type (level up, egg, or machine).
    let moveContent;
    for (let [method, moves] of Object.entries(this.moves)) {
      moveContent = '';
      moves.forEach((move) => {
        const level = move.level
          ? `<small class="text-success">Lv. ${move.level}</small> `
          : '';
        moveContent += `
        <span class="btn border rounded p-1 mb-1 mr-1"
          data-move="${capitalize(move.name)}">
          ${level}
          <small>${capitalize(move.name)}</small>
        </span>
      `;
      });
      this.moveDivs[method].innerHTML = moveContent;
    }
  }

  toggleMoves(e) {
    // Update Move type (level up, egg, or machine).
    const newMethod = e.target.closest('.btn').id;
    const currentMoveFilter = document.querySelector('.move-filter');
    if (currentMoveFilter && currentMoveFilter.id != newMethod) {
      currentMoveFilter.classList.remove('move-filter');
      this.moveDivs[currentMoveFilter.id].classList.add('d-none');
    }
    document.querySelector(`#${newMethod}`).classList.add('move-filter');
    this.moveDivs[newMethod].classList.remove('d-none');
  }
}
