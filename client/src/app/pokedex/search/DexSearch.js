export default class DexSearch {
  constructor() {
    this.form = document.createElement('form');
    this.form.classList = 'search-form';

    // Input submit group.
    const group = document.createElement('div');
    group.classList = 'input-group';
    this.form.append(group);

    const prepend = document.createElement('div');
    prepend.classList = 'input-group-prepend';
    group.append(prepend);

    const submitBtn = document.createElement('button');
    submitBtn.classList = 'btn btn-light border';
    submitBtn.setAttribute('type', 'submit');
    submitBtn.innerHTML = `<i class="fas fa-search"></i>`;
    prepend.append(submitBtn);

    // Search input.
    const searchInput = document.createElement('input');
    searchInput.classList = 'form-control';
    searchInput.setAttribute('type', 'text');
    searchInput.setAttribute('name', 'pokeSearchInput');
    searchInput.setAttribute('placeholder', 'Search Pokemon...');
    group.append(searchInput);
  }

  get() {
    return this.form;
  }
}
