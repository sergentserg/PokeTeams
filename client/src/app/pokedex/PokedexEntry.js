import PokedexEntrySummary from './PokedexEntrySummary';
import PokedexEntryStats from './PokedexEntryStats';
import PokedexEntryAbilities from './PokedexEntryAbilities';
import PokedexEntryMoves from './PokedexEntryMoves';

export default (function PokedexEntry() {
  const entry = document.createElement('div');
  entry.classList = 'row';

  const summaryCard = document.createElement('div');
  summaryCard.classList = 'col-sm-12 col-md-5 col-lg-3';
  entry.append(summaryCard);

  const detailsAccordion = document.createElement('div');
  detailsAccordion.classList = 'col-sm-12 col-md-7 col-lg-6 offset-lg-3';
  detailsAccordion.id = 'detailsAccordion';
  entry.append(detailsAccordion);

  return {
    component: entry,
    update: function (data) {
      const { name, dexID, types, height, weight } = data;
      while (summaryCard.firstElementChild)
        summaryCard.firstElementChild.remove();
      summaryCard.append(
        PokedexEntrySummary({ name, dexID, types, height, weight })
      );
      while (detailsAccordion.firstElementChild)
        detailsAccordion.firstElementChild.remove();
      detailsAccordion.append(PokedexEntryStats(data.stats));
      detailsAccordion.append(PokedexEntryAbilities(data.abilities));
      detailsAccordion.append(PokedexEntryMoves(data.moves));
      return summaryCard;
    },
  };
})();

{
  /* <div class="row">
<div class="col-sm-12 col-md-5 col-lg-3">
  <!-- Pokemon Details card. -->
  
</div>

<div class="col-sm-12 col-md-7 col-lg-6 offset-lg-3">
  <!-- Pokemon info accordion. -->
  <div id="detailsAccordion">
    <!-- BASE STATS -->
    
    <!-- ABILITIES -->
    
    <!-- MOVES -->
    
  </div>
</div>
</div> */
}
