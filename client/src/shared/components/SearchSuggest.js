import { INPUT_DELAY } from '../util/constants';

export default class SearchSuggest {
  constructor() {
    // Wrapper.
    this.group = document.createElement('div');
    this.group.classList.add('with-suggestions');

    // Search Input.
    this.search = document.createElement('input');
    this.search.setAttribute('type', 'text');
    this.search.setAttribute('autocomplete', 'off');
    // Optional class.
    this.search.classList.add('form-control', 'bg-light');

    this.group.append(this.search);

    // Suggestions list: defaults to not shown.
    this.ul = document.createElement('ul');
    this.ul.classList = 'border bg-white list-unstyled d-none small';
    this.group.append(this.ul);

    // Event listeners.
    this.search.addEventListener('keyup', this.filter.bind(this));
    // Timer for delaying filtering.
    this.searchTimer = 0;
  }

  filter(e) {
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => {
      const pattern = e.target.value.trim().toLowerCase();
      if (pattern !== '') {
        const matches = this.getMatches(pattern);
        this.suggest(matches);
      } else {
        this.ul.classList.add('d-none');
      }
    }, INPUT_DELAY);
  }

  // Subclasses must provide this definition.
  getMatches(pattern) {
    return [];
  }

  suggest(matches) {
    // Clear ul.
    while (this.ul.firstElementChild) this.ul.firstElementChild.remove();

    matches.forEach((data) => {
      const li = document.createElement('li');
      li.classList = 'px-4 py-2';
      this.suggestionLi(li, data);
      this.ul.append(li);
    });
    this.ul.classList.remove('d-none');
  }

  // Subclasses must provide this definition
  suggestionLi(li, data) {
    li.textContent = '';
    // li.setAttribute('item', `${item.name}`);
    // li.textContent = capitalize(item.name);
  }
}
