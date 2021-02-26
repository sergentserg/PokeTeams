import PokedexEntrySummary from './PokedexEntrySummary';
import PokedexEntryStats from './PokedexEntryStats';
import PokedexEntryAbilities from './PokedexEntryAbilities';
import PokedexEntryMoves from './PokedexEntryMoves';

export default class PokedexEntry {
  constructor() {
    this.entry = document.createElement('div');
    this.entry.id = 'pokemon';
    this.entry.classList = 'row';

    this.summaryCard = document.createElement('div');
    this.summaryCard.classList = 'col-sm-12 col-md-5 col-lg-3';
    this.entry.append(this.summaryCard);

    this.detailsAccordion = document.createElement('div');
    this.detailsAccordion.classList = 'col-sm-12 col-md-7 col-lg-7 offset-lg-2';
    this.detailsAccordion.id = 'detailsAccordion';
    this.entry.append(this.detailsAccordion);

    // Summary.
    this.entrySummary = new PokedexEntrySummary();
    this.summaryCard.append(this.entrySummary.get());

    // Stats Accordion.
    this.entryStats = new PokedexEntryStats();
    this.detailsAccordion.append(this.entryStats.get());

    // Ability Accordion.
    this.entryAbilities = new PokedexEntryAbilities();
    this.detailsAccordion.append(this.entryAbilities.get());

    // Moves Accordion.
    this.entryMoves = new PokedexEntryMoves();
    this.detailsAccordion.append(this.entryMoves.get());
  }

  get() {
    return this.entry;
  }

  update() {
    this.entrySummary.update();
    this.entryStats.update();
    this.entryAbilities.update();
    this.entryMoves.update();
  }
}
