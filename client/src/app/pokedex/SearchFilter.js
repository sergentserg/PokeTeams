export default class SearchFilter {
  constructor() {
    this.searchFilter = document.createElement('div');
    this.searchFilter.setAttribute('class', 'mt-1');

    this.filterBtn = document.createElement('button');
    this.filterBtn.setAttribute('class', 'btn btn-dark d-none');
    this.searchFilter.append(this.filterBtn);

    this.filterText = document.createElement('span');
    this.filterBtn.append(this.filterText);

    const icon = document.createElement('i');
    icon.classList = 'fas fa-times-circle fa-xs';
    this.filterBtn.append(icon);
  }
  getComponent() {
    return this.searchFilter;
  }

  update(searchQuery) {
    this.filterText.textContent = `"${searchQuery}" `;
    this.filterBtn.classList.remove('d-none');
  }
}
