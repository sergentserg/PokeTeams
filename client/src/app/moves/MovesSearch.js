import SearchSuggest from 'src/shared/components/SearchSuggest';
import { moveState } from './MoveState';

export default class MoveSearch extends SearchSuggest {
  constructor() {
    super();
    this.row = document.createElement('div');
    this.row.classList.add('row');

    const col = document.createElement('div');
    col.classList.add('col-md-4');
    this.row.append(col);

    this.group.classList.add('input-group');
    col.append(this.group);

    const prepend = document.createElement('div');
    prepend.classList.add('input-group-prepend');
    prepend.innerHTML = `
      <span class="input-group-text bg-light">
        <i class="fas fa-search"></i>
      </span>
    `;
    this.group.insertBefore(prepend, this.group.firstElementChild);

    this.search.setAttribute('name', 'moveSearch');
    this.search.setAttribute('placeholder', 'Search moves...');
  }

  get() {
    return this.row;
  }

  getMatches(pattern) {
    const matches = moveState.filter(pattern);
    return matches;
  }

  suggestionLi(li, data) {
    li.setAttribute('data-move-url', `${data.url}`);
    li.textContent = data.name;
  }
}
