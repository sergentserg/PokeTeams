export default class PokedexEntryNav {
  constructor(previous, next) {
    this.nav = document.createElement('nav');
    this.nav.classList = 'mt-4';
    this.nav.setAttribute('aria-label', 'Pokemon Pokedex entries');

    const pagination = document.createElement('ul');
    pagination.classList = 'pagination';
    this.nav.append(pagination);

    let navContent = '';
    if (previous !== null) {
      navContent += `
        <li class="page-item mr-auto">
          <a href="#" class="page-link" data-dexID="${previous}">&#8592; No. ${previous}</a>
        </li>
      `;
    }
    if (next !== null) {
      navContent += `
        <li class="page-item ml-auto">
          <a href="#" class="page-link" data-dexID="${next}">No. ${next} &#8594;</a>
        </li>
      `;
    }
    pagination.innerHTML = navContent;
  }

  getComponent() {
    return this.nav;
  }
}
