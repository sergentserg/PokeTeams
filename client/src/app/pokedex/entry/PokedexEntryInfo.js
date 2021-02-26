// Abstract class
export default class PokedexEntryInfo {
  constructor(title, collapseID) {
    this.card = document.createElement('div');
    this.card.classList = 'card';

    // Card Header.
    const header = document.createElement('div');
    this.card.append(header);
    header.classList = 'card-header bg-danger text-white';
    header.innerHTML = `
    <h5>
      <a
        href="#${collapseID}"
        data-parent="#detailsAccordion"
        data-toggle="collapse"
      >
        ${title}
      </a>
    </h5>
  `;

    // Card body.
    const collapse = document.createElement('div');
    this.card.append(collapse);
    collapse.classList = 'collapse';
    collapse.id = `${collapseID}`;

    this.cardBody = document.createElement('div');
    collapse.append(this.cardBody);
    this.cardBody.classList = 'card-body';
  }

  get() {
    return this.card;
  }
}
