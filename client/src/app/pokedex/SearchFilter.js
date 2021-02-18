export default (function SearchFilter() {
  const searchFilter = document.createElement('div');
  searchFilter.setAttribute('class', 'mt-1');

  const filterBtn = document.createElement('button');
  filterBtn.setAttribute('class', 'btn btn-dark d-none');
  searchFilter.append(filterBtn);

  const filterText = document.createElement('span');
  filterBtn.append(filterText);

  const icon = document.createElement('i');
  icon.classList = 'fas fa-times-circle fa-xs';
  filterBtn.append(icon);
  return {
    component: searchFilter,
    update: function (searchQuery) {
      filterText.textContent = `"${searchQuery}" `;
      filterBtn.classList.remove('d-none');
    },
  };
})();
