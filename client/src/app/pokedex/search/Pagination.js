import { PAGINATION_LIMIT } from 'src/shared/util/constants';
import { pokedexState } from '../PokedexState';

export default class Pagination {
  constructor() {
    // Number of pagination links.

    // this.Nav element (pagination wrapper).
    this.nav = document.createElement('nav');
    this.nav.setAttribute('class', 'd-flex justify-content-center');
    this.nav.setAttribute('aria-label', 'Search results pages');

    // ul element with pagination links.
    this.pagination = document.createElement('ul');
    this.pagination.setAttribute('class', 'pagination justify-content-center');
    [
      { class: 'first', text: 'First' },
      { class: 'prev', text: '&lt;&lt;' },
      { class: 'next', text: '&gt;&gt;' },
      { class: 'last', text: 'Last' },
    ].forEach((option) => {
      const li = document.createElement('li');
      li.setAttribute('class', `page-item pagination-${option.class}`);
      li.innerHTML = `<button href="#" class="page-link">${option.text}</button>`;
      this.pagination.append(li);
    });

    this.nav.append(this.pagination);
  }

  get() {
    return this.nav;
  }

  getLinks() {
    return this.pagination;
  }

  update() {
    const totalPages = pokedexState.getTotalPages();
    const newActive = pokedexState.getPageNumber();
    const newFirst =
      PAGINATION_LIMIT * Math.floor((newActive - 1) / PAGINATION_LIMIT) + 1;
    if (totalPages <= 1) {
      this.nav.classList.remove('d-flex');
      this.nav.classList.add('d-none');
      return;
    }
    const firstLi = this.pagination.firstElementChild;
    const lastLi = this.pagination.lastElementChild;
    const prevLi = firstLi.nextElementSibling;
    const nextLi = lastLi.previousElementSibling;

    // Reset the pagination element.
    while (prevLi.nextElementSibling !== nextLi) {
      prevLi.nextElementSibling.remove();
    }

    // Create this.navigation links.
    const maxPageLinks = Math.min(totalPages - newFirst + 1, PAGINATION_LIMIT);

    for (let i = 0; i < maxPageLinks; i++) {
      const li = document.createElement('li');
      li.classList.add('page-item');
      li.setAttribute('data-page-num', `${newFirst + i}`);
      li.innerHTML = `
          <button href="#" class="page-link">
            ${newFirst + i}
          </button>
        `;
      this.pagination.insertBefore(li, nextLi);
    }

    // Disallow clicks on active li.
    const activeLi = this.pagination.querySelector(
      `[data-page-num="${newActive}"]`
    );
    activeLi.classList.add('active');

    // Disable edge-case links.
    if (newActive > 1 && newActive < totalPages) {
      [firstLi, prevLi, nextLi, lastLi].forEach((li) =>
        li.classList.remove('disabled')
      );
    } else if (newActive === 1) {
      [firstLi, prevLi].forEach((li) => li.classList.add('disabled'));
      [nextLi, lastLi].forEach((li) => li.classList.remove('disabled'));
    } else if (newActive === totalPages) {
      [firstLi, prevLi].forEach((li) => li.classList.remove('disabled'));
      [nextLi, lastLi].forEach((li) => li.classList.add('disabled'));
    }

    // Display ellipses.
    if (totalPages > PAGINATION_LIMIT) {
      // Create ellipses element.
      const li = document.createElement('li');
      li.classList.add('page-item', 'disabled');
      li.setAttribute('data-page-num', 'ellipsis');
      li.innerHTML = `<button href="#" class="page-link">...</button>`;

      // Ellipsis on the left.
      if (totalPages - newFirst < PAGINATION_LIMIT) {
        const newFirstPageLi = prevLi.nextElementSibling;
        this.pagination.insertBefore(li, newFirstPageLi);
      } else {
        // Ellipsis on right.
        this.pagination.insertBefore(li, nextLi);
      }
    }

    // Display it in the UI.
    this.nav.classList.remove('d-none');
    this.nav.classList.add('d-flex');
  }
}
