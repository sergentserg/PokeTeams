export default function InputWithSuggest() {
  const group = document.createElement('div');
  group.classList.add('with-suggestions');

  const search = document.createElement('input');
  search.classList.add('form-control', 'bg-light');
  search.setAttribute('type', 'text');
  search.setAttribute('autocomplete', 'off');
  group.append(search);

  const ul = document.createElement('ul');
  ul.classList = 'border bg-white list-unstyled d-none small';
  group.append(ul);
  return group;
}
