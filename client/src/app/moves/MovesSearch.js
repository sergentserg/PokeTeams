import InputWithSuggest from 'src/shared/components/InputWithSuggest';

export default (function MoveSearch() {
  const moveSearchRow = document.createElement('div');
  moveSearchRow.classList.add('row');

  const moveSearchCol = document.createElement('div');
  moveSearchCol.classList.add('col-md-4');
  moveSearchRow.append(moveSearchCol);

  const form = document.createElement('form');
  form.classList.add('mb-4');
  moveSearchCol.append(form);

  const group = InputWithSuggest();
  group.classList.add('input-group');
  form.append(group);

  const prepend = document.createElement('div');
  prepend.classList.add('input-group-prepend');
  prepend.innerHTML = `
    <span class="input-group-text bg-light">
      <i class="fas fa-search"></i>
    </span>
  `;
  group.insertBefore(prepend, group.firstElementChild);
  const searchInput = group.querySelector('input');
  searchInput.setAttribute('name', 'moveSearch');
  searchInput.setAttribute('placeholder', 'Search moves...');

  return {
    component: moveSearchRow,
    update: function (matches) {
      const ul = moveSearchRow.querySelector('ul');
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
