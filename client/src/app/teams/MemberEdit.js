import PokedexEntry from '../pokedex/PokedexEntry';
import MemberForm from './MemberForm';
import { teamState } from './TeamState';

export default class MemberEdit {
  constructor() {
    this.memberEdit = document.createElement('div');
    this.memberEdit.id = 'memberEdit';

    this.memberForm = new MemberForm();
    this.memberEdit.append(this.memberForm.getComponent());

    this.dexEntry = new PokedexEntry();
    this.memberEdit.append(this.dexEntry.getComponent());

    this.dexEntry
      .getComponent()
      .querySelector('#shownMoves')
      .addEventListener('click', this.chooseMove.bind(this));
  }
  getComponent() {
    return this.memberEdit;
  }

  update() {
    // Show the member form.
    this.memberForm.update();
    this.dexEntry.update();
    this.chooseMove();
  }

  chooseMove(e) {
    // Select moves upon loading memberEdit (updating) element.
    if (!e) {
      const moves = teamState.getMember().moves;
      const moveDivs = this.dexEntry.getComponent().querySelector('#shownMoves')
        .children;
      let moveList = [];
      for (let i = 0; i < moveDivs.length; i++) {
        moveList = moveList.concat(Array.from(moveDivs[i].children));
      }

      moveList.forEach((span) => {
        if (moves.includes(span.getAttribute('data-move'))) {
          span.classList.toggle('bg-warning');
        }
      });
    } else {
      const moveName =
        e.target.getAttribute('data-move') ||
        e.target.parentElement.getAttribute('data-move');
      if (moveName) {
        const span = e.target.closest('span');
        const toggled = this.memberForm.toggleMove(moveName);
        if (toggled) {
          span.classList.toggle('bg-warning');
        }
      }
    }
  }
}
