import SearchSuggest from 'src/shared/components/SearchSuggest';
import { capitalize } from 'src/shared/util/capitalize';
import { itemState } from './ItemState';

export default class ItemSearch extends SearchSuggest {
  constructor() {
    super();
    this.group.classList.add('d-inline-block', 'mb-2');

    this.search.classList.add('mr-2');
    this.search.setAttribute('name', 'itemName');

    const itemLabel = document.createElement('label');
    itemLabel.classList = 'mr-2';
    itemLabel.setAttribute('for', 'itemName');
    itemLabel.textContent = 'Item';
    this.group.insertBefore(itemLabel, this.search);
  }

  get() {
    return this.group;
  }

  getMatches(pattern) {
    const matches = itemState
      .getItems()
      .filter((item) => item.name.toLowerCase().includes(pattern));
    return matches;
  }

  suggestionLi(li, data) {
    li.setAttribute('item', `${data.name}`);
    li.textContent = capitalize(data.name);
  }
}
