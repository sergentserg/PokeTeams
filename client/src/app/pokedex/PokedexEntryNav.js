export default function PokedexEntryNav(previous, next) {
  const nav = document.createElement('nav');
  nav.classList = 'mt-4';
  nav.setAttribute('aria-label', 'Pokemon Pokedex entries');

  const pagination = document.createElement('ul');
  pagination.classList = 'pagination';
  nav.append(pagination);

  let navContent = '';
  if (previous !== null) {
    navContent += `
        <li class="page-item mr-auto">
          <a href="#" class="page-link" data-dexID="${previous}">&#8592; No. ${previous}</a>
        </li>
      `;
    // <!-- <li id="previousMon" class="page-item">
    //         <button href="#" class="page-link d-none">&#8592; #001 Bulbasaur</button>
    //       </li>
  }
  if (next !== null) {
    navContent += `
        <li class="page-item ml-auto">
          <a href="#" class="page-link" data-dexID="${next}">No. ${next} &#8594;</a>
        </li>
      `;
  }
  pagination.innerHTML = navContent;
  return pagination;
}
