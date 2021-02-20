import MovesSearch from './MovesSearch';
import MovesDetails from './MovesDetails';
import { INPUT_DELAY } from 'src/shared/util/constants';

export default class MovesView {
  constructor(state) {
    this.state = state;
    this.view = document.querySelector('.main');
    this.view.id = 'moves';
    this.searchTimer = 0;
  }

  render() {
    // Header
    const title = document.createElement('h2');
    title.textContent = 'Moves';
    this.view.append(title);

    // Search component.
    MovesSearch.component
      .querySelector('input')
      .addEventListener('keydown', this.filterMoves.bind(this));
    MovesSearch.component
      .querySelector('ul')
      .addEventListener('click', this.loadMove.bind(this));

    // MoveDetails area.
    this.view.append(MovesSearch.component);
    this.view.append(MovesDetails.component);
  }

  filterMoves(e) {
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(
      function () {
        const pattern = e.target.value.trim().toLowerCase();
        if (pattern != '') {
          const matches = this.state.filter(pattern);
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
    this.state.getMove(moveUrl).then((move) => {
      move.name = e.target.textContent;
      MovesDetails.update(move);
      MovesSearch.component.querySelector('ul').classList.add('d-none');
    });
  }
}
