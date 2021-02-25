import MoveDetails from './MoveDetails';
import { moveState } from './MoveState';
import MoveSearch from './MovesSearch';

export default class MovesView {
  constructor(main) {
    this.main = main;
    this.main.id = 'moves';

    this.moveSearch = new MoveSearch();
    this.moveDetails = new MoveDetails();
    this.moveSearch.ul.addEventListener('click', this.loadMove.bind(this));
  }

  render() {
    // Header
    const title = document.createElement('h2');
    title.textContent = 'Moves';
    this.main.append(title);

    // MoveDetails area.
    this.main.append(this.moveSearch.get());
    this.main.append(this.moveDetails.get());
  }

  async loadMove(e) {
    const moveUrl = e.target.getAttribute('data-move-url');
    await moveState.setMove(moveUrl);
    this.moveDetails.update();
    this.moveSearch.ul.classList.add('d-none');
  }
}
