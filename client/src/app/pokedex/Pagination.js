export default (function Pagination() {
  // Number of pagination links.
  let PAGINATION_LIMIT;
  if (window.matchMedia('(max-width: 576px)').matches) {
    PAGINATION_LIMIT = 1;
  } else {
    PAGINATION_LIMIT = 5;
  }
  // Nav element (pagination wrapper).
  const nav = document.createElement('nav');
  nav.setAttribute('class', 'd-flex justify-content-center');
  nav.setAttribute('aria-label', 'Search results pages');

  // ul element with pagination links.
  const pagination = document.createElement('ul');
  pagination.setAttribute('class', 'pagination justify-content-center');
  [
    { class: 'first', text: 'First' },
    { class: 'prev', text: '&lt;&lt;' },
    { class: 'next', text: '&gt;&gt;' },
    { class: 'last', text: 'Last' },
  ].forEach((option) => {
    const li = document.createElement('li');
    li.setAttribute('class', `page-item pagination-${option.class}`);
    li.innerHTML = `<button href="#" class="page-link">${option.text}</button>`;
    pagination.append(li);
  });

  nav.append(pagination);

  return {
    component: nav,
    PAGINATION_LIMIT,
    update: function (totalPages, newFirst = 1, newActive = 1) {
      if (totalPages < 1) {
        pagination.parentElement.classList.add('d-none');
        return;
      }
      const firstLi = pagination.firstElementChild;
      const lastLi = pagination.lastElementChild;
      const prevLi = firstLi.nextElementSibling;
      const nextLi = lastLi.previousElementSibling;

      // Reset the pagination element.
      while (prevLi.nextElementSibling !== nextLi) {
        prevLi.nextElementSibling.remove();
      }

      // Create navigation links.
      const maxPageLinks = Math.min(
        totalPages - newFirst + 1,
        PAGINATION_LIMIT
      );

      for (let i = 0; i < maxPageLinks; i++) {
        const li = document.createElement('li');
        li.classList.add('page-item');
        li.setAttribute('data-page-num', `${newFirst + i}`);
        li.innerHTML = `
            <button href="#" class="page-link">
              ${newFirst + i}
            </button>
          `;
        pagination.insertBefore(li, nextLi);
      }

      // Disallow clicks on active li.
      const activeLi = pagination.querySelector(
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
          pagination.insertBefore(li, newFirstPageLi);
        } else {
          // Ellipsis on right.
          pagination.insertBefore(li, nextLi);
        }
      }

      // Display it in the UI.
      nav.classList.remove('d-none');
    },
  };
})();
