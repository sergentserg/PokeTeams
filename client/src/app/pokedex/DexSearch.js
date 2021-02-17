// import searchPokemon from '../utils/searchPokemon';
import { DOMElement } from 'src/shared/components/DOMElement';

export default function DexSearch() {
  const form = DOMElement('form', { class: 'search-form' });

  const inputGroup = document.createElement('div');
  inputGroup.classList = 'input-group';
  form.append(inputGroup);

  const inputGroupPrepend = document.createElement('div');
  inputGroupPrepend.classList = 'input-group-prepend';
  inputGroup.append(inputGroupPrepend);

  const pokeSearchBtn = DOMElement('button', {
    class: 'btn btn-light border',
    type: 'submit',
  });
  pokeSearchBtn.innerHTML = `<i class="fas fa-search"></i>`;
  inputGroupPrepend.append(pokeSearchBtn);

  // Search input.
  const searchInput = DOMElement('input', {
    type: 'text',
    name: 'pokeSearchInput',
    class: 'form-control',
    placeholder: 'Search Pokemon...',
  });
  inputGroup.append(searchInput);
  return form;
}
