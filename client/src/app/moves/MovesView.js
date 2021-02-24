import MovesSearch from './MovesSearch';
import MovesDetails from './MovesDetails';
import { INPUT_DELAY } from 'src/shared/util/constants';
import { movesState } from './MovesState';

export default class MovesView {
  constructor(main) {
    this.main = main;
    this.main.id = 'moves';
    this.searchTimer = 0;
  }

  render() {
    // Header
    const title = document.createElement('h2');
    title.textContent = 'Moves';
    this.main.append(title);

    // Search component.
    MovesSearch.component
      .querySelector('input')
      .addEventListener('keydown', this.filterMoves.bind(this));
    MovesSearch.component
      .querySelector('ul')
      .addEventListener('click', this.loadMove.bind(this));

    // MoveDetails area.
    this.main.append(MovesSearch.component);
    this.main.append(MovesDetails.component);
  }

  filterMoves(e) {
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(
      function () {
        const pattern = e.target.value.trim().toLowerCase();
        if (pattern != '') {
          const matches = movesState.filter(pattern);
          MovesSearch.update(matches);
        } else {
          MovesSearch.component.querySelector('ul').classList.add('d-none');
        }
      }.bind(this),
      INPUT_DELAY
    );
  }

  loadMove(e) {
    const moveUrl = e.target.getAttribute('data-move-url');
    movesState.getMove(moveUrl).then((move) => {
      move.name = e.target.textContent;
      MovesDetails.update(move);
      MovesSearch.component.querySelector('ul').classList.add('d-none');
    });
  }
}
