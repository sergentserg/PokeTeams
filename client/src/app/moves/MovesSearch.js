export default (function MoveSearch() {
  const moveSearchRow = document.createElement('div');
  moveSearchRow.classList.add('row');

  const moveSearchCol = document.createElement('div');
  moveSearchCol.classList.add('col-md-4');
  moveSearchRow.append(moveSearchCol);

  const form = document.createElement('form');
  form.classList.add('mb-4');
  moveSearchCol.append(form);

  const group = document.createElement('div');
  group.classList.add('input-group');
  form.append(group);

  const prepend = document.createElement('div');
  prepend.classList.add('input-group-prepend');
  prepend.innerHTML = `
    <span class="input-group-text bg-light">
      <i class="fas fa-search"></i>
    </span>
  `;
  group.append(prepend);

  const search = document.createElement('input');
  search.classList.add('form-control', 'bg-light');
  search.setAttribute('type', 'text');
  search.setAttribute('name', 'moveSearch');
  search.setAttribute('placeholder', 'Search moves...');
  search.setAttribute('autocomplete', 'off');
  group.append(search);

  // Move List
  const ul = document.createElement('ul');
  ul.classList = 'border bg-white list-unstyled d-none small';
  group.append(ul);

  return {
    component: moveSearchRow,
    update: function (matches) {
      while (ul.firstElementChild) ul.firstElementChild.remove();
      matches.forEach((move) => {
        const li = document.createElement('li');
        li.classList = 'px-4 py-2';
        li.setAttribute('data-move-url', `${move.url}`);
        li.textContent = move.name;
        ul.append(li);
      });
      ul.classList.remove('d-none');
    },
  };
})();
