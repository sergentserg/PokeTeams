import InputWithSuggest from 'src/shared/components/InputWithSuggest';
import { INPUT_DELAY } from 'src/shared/util/constants';
import { capitalize } from 'src/shared/util/capitalize';
import { itemState } from './ItemState';

export default class ItemSearch {
  constructor() {
    this.searchTimer = 0;
    this.formGroup = InputWithSuggest();
    this.formGroup.classList.add('d-inline-block', 'mb-2');

    const searchInput = this.formGroup.querySelector('input');
    searchInput.classList.add('mr-2');
    searchInput.setAttribute('name', 'itemName');
    searchInput.addEventListener('keyup', this.filterItems.bind(this));

    const itemLabel = document.createElement('label');
    itemLabel.classList = 'mr-2';
    itemLabel.setAttribute('for', 'itemName');
    itemLabel.textContent = 'Item';
    this.formGroup.insertBefore(itemLabel, searchInput);

    this.ul = this.formGroup.querySelector('ul');
    // this.ul.addEventListener('click', this.showItems.bind(this));
  }

  getComponent() {
    return this.formGroup;
  }

  showSuggestions(matches) {
    while (this.ul.firstElementChild) this.ul.firstElementChild.remove();
    matches.forEach((item) => {
      const li = document.createElement('li');
      li.classList = 'px-4 py-2';
      li.setAttribute('item', `${item.name}`);
      li.textContent = capitalize(item.name);
      this.ul.append(li);
    });
    this.ul.classList.remove('d-none');
  }

  filterItems(e) {
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(
      function () {
        const pattern = e.target.value.trim().toLowerCase();
        if (pattern != '') {
          const matches = itemState
            .getItems()
            .filter((item) => item.name.toLowerCase().includes(pattern));
          this.showSuggestions(matches);
        } else {
          this.ul.classList.add('d-none');
        }
      }.bind(this),
      INPUT_DELAY
    );
  }
}
