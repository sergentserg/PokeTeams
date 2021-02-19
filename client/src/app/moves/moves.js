const MovesCtrl = (function () {
  let moves;

  async function getMoves() {
    const response = await fetch(MOVES_URL);
    const data = await response.json();
    moves = data.results.map((move) => ({
      ...move,
      name: capitalize(move.name.replaceAll('-', ' ')),
    }));
  }

  return {
    init: async function () {
      await getMoves();
    },
    filter: function (pattern) {
      return moves.filter((move) =>
        move.name.toLowerCase().startsWith(pattern)
      );
    },
  };
})();

const UICtrl = (function () {
  const UISelectors = {
    moveForm: '#moveForm',
    moveSearch: '#moveSearch',
    moveList: '#moveList',
    moveName: '#moveName',
    moveDescription: '#moveDescription',
    moveCategory: '#moveCategory',
    movePower: '#movePower',
    moveAccuracy: '#moveAccuracy',
    moveType: '#moveType',
    movePP: '#movePP',
    moveEffectChance: '#moveEffectChance',
    moveTarget: '#moveTarget',
    moveIntroduced: '#moveIntroduced',
    effectContainer: '#effectContainer',
    effectEntry: '#effectEntry',
    movePriority: '#priority',
    priorityBar: '#priorityBar',
  };

  const categoryIcon = {
    status: '<i class="text-muted fas fa-adjust fa-lg"></i>',
    physical: '<i class="text-muted fas fa-fist-raised fa-lg"></i>',
    special: '<i class="text-muted fas fa-hat-wizard fa-lg"></i>',
  };

  return {
    getSelectors: function () {
      return UISelectors;
    },
    displayMoves: function (moves) {
      const moveList = document.querySelector(UISelectors.moveList);
      content = '';
      moves.forEach((move) => {
        content += `
          <li class="px-4 py-2" data-move-url="${move.url}">
            ${move.name}
          </li>`;
      });
      moveList.innerHTML = content;
      moveList.classList.remove('d-none');
    },
    loadMove: function (move) {
      // Move Name
      document.querySelector(UISelectors.moveName).textContent = move.name;

      // Description
      const description = move.flavor_text_entries.find(
        (item) =>
          item.language.name === 'en' &&
          item.version_group.name === GAME_VERSION
      );
      document.querySelector(UISelectors.moveDescription).textContent =
        description.flavor_text;

      // Move Category
      document.querySelector(UISelectors.moveCategory).innerHTML =
        categoryIcon[move.damage_class.name];

      // Move Power
      document.querySelector(UISelectors.movePower).innerHTML =
        move.power || '---';

      // Move Accuracy
      document.querySelector(UISelectors.moveAccuracy).innerHTML =
        move.accuracy || '---';

      // Move Type
      document.querySelector(UISelectors.moveType).innerHTML = `
        <small class="type-${move.type.name}">${capitalize(
        move.type.name
      )}</small>
      `;

      // Move PP
      document.querySelector(UISelectors.movePP).innerHTML = move.pp;

      // Effect Chance
      document.querySelector(UISelectors.moveEffectChance).innerHTML =
        move.effect_chance || '---';

      // Move Target
      const moveTarget = capitalize(move.target.name.replace('-', ' '));
      document.querySelector(UISelectors.moveTarget).innerHTML = moveTarget;

      // Generation
      document.querySelector(UISelectors.moveIntroduced).innerHTML = `
        Generation ${move.generation.name.split('-')[1].toUpperCase()}
      `;

      // Move Effect Entry
      const moveEffectEntry =
        move.effect_entries.find((entry) => entry.language.name === 'en')
          .effect || '...';

      document.querySelector(
        UISelectors.effectEntry
      ).innerText = moveEffectEntry.replace(
        '$effect_chance',
        move.effect_chance
      );

      // Priority
      document.querySelector(UISelectors.movePriority).innerHTML =
        move.priority;
      const barWidth =
        (100 / MOVE_PRIORITY_COUNT) * (move.priority - SLOWEST_MOVE + 1);
      document.querySelector(
        UISelectors.priorityBar
      ).style.width = `${barWidth}%`;

      moveList.classList.add('d-none');
    },
  };
})();

const AppCtrl = (function (UICtrl, MovesCtrl) {
  const INPUT_DELAY = 500;
  const filterMoves = debounce((e) => {
    const pattern = e.target.value.trim().toLowerCase();
    if (pattern != '') {
      const matches = MovesCtrl.filter(pattern);
      UICtrl.displayMoves(matches);
    }
  }, INPUT_DELAY);

  function loadEventListeners() {
    const { moveSearch, moveList } = UICtrl.getSelectors();
    document.querySelector(moveSearch).addEventListener('keydown', filterMoves);
    document.querySelector(moveList).addEventListener('click', loadMove);
  }

  async function loadMove(e) {
    const response = await fetch(e.target.getAttribute('data-move-url'));
    const move = await response.json();
    move.name = e.target.innerText;
    UICtrl.loadMove(move);
  }

  return {
    init: async function () {
      authenticate();
      loadEventListeners();
      await MovesCtrl.init();
      // Check for move in local storage.
    },
  };
})(UICtrl, MovesCtrl);

AppCtrl.init();
