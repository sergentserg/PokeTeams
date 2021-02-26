import PokedexEntryInfo from './PokedexEntryInfo';
import { capitalize } from 'src/shared/util/capitalize';
import { pokedexState } from '../PokedexState';

export default class PokedexEntryMoves extends PokedexEntryInfo {
  constructor() {
    super('Moves', 'movesAccord');

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
    this.cardBody.append(levelBtn);

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
    this.cardBody.append(eggBtn);

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
    this.cardBody.append(machineBtn);

    // Moves for current Pokemon.
    this.moves = null;

    const moveBtns = [levelBtn, eggBtn, machineBtn];
    for (let i = 0; i < moveBtns.length; i++) {
      moveBtns[i].addEventListener('click', this.toggleMoves.bind(this));
    }

    this.shownMoves = document.createElement('div');
    this.shownMoves.id = 'shownMoves';
    this.shownMoves.classList = 'p-3 mt-2 border rounded';
    this.cardBody.append(this.shownMoves);

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

  get() {
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
