export default function DexSearch() {
  const form = document.createElement('form');
  form.classList = 'search-form';

  const inputGroup = document.createElement('div');
  inputGroup.classList = 'input-group';
  form.append(inputGroup);

  const inputGroupPrepend = document.createElement('div');
  inputGroupPrepend.classList = 'input-group-prepend';
  inputGroup.append(inputGroupPrepend);

  const pokeSearchBtn = document.createElement('button');
  let attributes = {
    class: 'btn btn-light border',
    type: 'submit',
  };
  for (const [key, value] of Object.entries(attributes)) {
    pokeSearchBtn.setAttribute(key, value);
  }
  pokeSearchBtn.innerHTML = `<i class="fas fa-search"></i>`;
  inputGroupPrepend.append(pokeSearchBtn);

  // Search input.
  attributes = {
    type: 'text',
    name: 'pokeSearchInput',
    class: 'form-control',
    placeholder: 'Search Pokemon...',
  };
  const searchInput = document.createElement('input');
  for (const [key, value] of Object.entries(attributes)) {
    searchInput.setAttribute(key, value);
  }
  inputGroup.append(searchInput);
  return form;
}
