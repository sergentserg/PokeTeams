import PokedexEntrySummary from './PokedexEntrySummary';
import PokedexEntryStats from './PokedexEntryStats';
import PokedexEntryAbilities from './PokedexEntryAbilities';
import PokedexEntryMoves from './PokedexEntryMoves';

export default class PokedexEntry {
  constructor() {
    this.entry = document.createElement('div');
    this.entry.classList = 'row';

    this.summaryCard = document.createElement('div');
    this.summaryCard.classList = 'col-sm-12 col-md-5 col-lg-3';
    this.entry.append(this.summaryCard);

    this.detailsAccordion = document.createElement('div');
    this.detailsAccordion.classList = 'col-sm-12 col-md-7 col-lg-6 offset-lg-3';
    this.detailsAccordion.id = 'detailsAccordion';
    this.entry.append(this.detailsAccordion);
  }

  getComponent() {
    return this.entry;
  }

  update(data) {
    const { name, dexID, types, height, weight } = data;
    while (this.summaryCard.firstElementChild)
      this.summaryCard.firstElementChild.remove();
    this.summaryCard.append(
      PokedexEntrySummary({ name, dexID, types, height, weight })
    );
    while (this.detailsAccordion.firstElementChild)
      this.detailsAccordion.firstElementChild.remove();
    this.detailsAccordion.append(PokedexEntryStats(data.stats));
    this.detailsAccordion.append(PokedexEntryAbilities(data.abilities));
    this.detailsAccordion.append(PokedexEntryMoves(data.moves));
    // return this.summaryCard;
  }
}
