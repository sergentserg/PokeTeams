const UICtrl = (function () {
  const UISelectors = {
    height: '#height',
    weight: '#weight',
    dexID: '#dexID',
    pokeName: '#pokeName',
    spriteWrap: '#spriteWrap',
    types: '#pokeTypes',
    stats: [
      '#hpBar',
      '#atkBar',
      '#defBar',
      '#spatkBar',
      '#spdefBar',
      '#spdBar',
    ],
    abilities: '#pokeAbilities',
    moves: '#moveNames',
    eggBtn: '#egg',
    machineBtn: '#machine',
    lvlBtn: '#levelUp',
    nav: '.pagination',
  };

  function displayCard(pokemon) {
    // Pokemon card: dexID, height, weight, img.
    document.querySelector(UISelectors.height).innerHMTL = `${pokemon.dexID}`;
    document.querySelector(UISelectors.pokeName).innerHTML = `${pokemon.name}`;
    document.querySelector(UISelectors.spriteWrap).innerHTML = `
  <img
    src=${pokeSpriteURL(pokemon.dexID)}
    alt="${pokemon.name}"
  />
`;

    // Type Badges.
    let typesContent = '';
    pokemon.types.forEach((slot) => {
      const type = slot.type.name;
      typesContent += `
    <small class="type-${type} mx-1">${capitalize(type)}</small>
  `;
    });
    document.querySelector(UISelectors.types).innerHTML = typesContent;
  }

  // Stats
  function displayStats(stats) {
    for (let i = 0; i < stats.length; i++) {
      const statBar = document.querySelector(UISelectors.stats[i]);
      statBar.style.width = `${(100 * stats[i].base_stat) / 255}%`;
      statBar.setAttribute('aria-valuenow', `${stats[i].base_stat}`);
      statBar.innerHTML = `${stats[i].base_stat}`;
    }
  }

  // Abilities
  function displayAbilities(abilities) {
    abilities.forEach(async (slot) => {
      const response = await fetch(slot.ability.url);
      const data = await response.json();
      const enAbility = data.effect_entries.find(
        (entry) => entry.language.name === 'en'
      );
      const abilityEffect = enAbility.short_effect;
      const li = document.createElement('li');
      li.classList.add('list-group-item');

      li.innerHTML = `
          <div class="d-flex justify-content-between align-items-center">
            <strong>${capitalize(slot.ability.name)}</strong>
            <i class="far fa-eye"></i>
          </div>
          ${
            slot.is_hidden
              ? '<small class="text-success">Hidden Ability</small><br>'
              : ''
          }
          <small class="text-muted">${abilityEffect}</small>
      `;
      document.querySelector(UISelectors.abilities).appendChild(li);
    });
  }

  function displayMoves(moves) {
    const moveContainer = document.querySelector(UISelectors.moves);
    // Clear Current Moves
    while (moveContainer.firstElementChild) {
      moveContainer.firstElementChild.remove();
    }

    let movesContent = '';
    moves.forEach((move) => {
      const level = move.level
        ? `<span class="text-success">Lv. ${move.level}</span> `
        : '';
      movesContent += `
        <a class="btn text-primary bg-light border rounded p-1 mb-1 mr-1">
          <small>${level}${capitalize(move.name)}
          </small>
        </a>
      `;
    });
    moveContainer.innerHTML = movesContent;
  }

  // Allows navigation to previous and next pokemon, if one exists.
  function displayPokeNav(previous, next) {
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
    document.querySelector(UISelectors.nav).innerHTML = navContent;
  }

  return {
    UISelectors,
    displayMoves: displayMoves,
    render: function (pokemon) {
      displayCard(pokemon);
      displayStats(pokemon.stats);
      displayAbilities(pokemon.abilities);
      // Display level up moves by default.
      displayMoves(pokemon.moves.levelUp);
      displayPokeNav(pokemon.previous, pokemon.next);
    },
  };
})();

const AppCtrl = (function (UICtrl) {
  let pokemon;

  function loadEventListeners() {
    const { lvlBtn, eggBtn, machineBtn, nav } = UICtrl.UISelectors;
    document.querySelector(lvlBtn).addEventListener('click', filterMoves);
    document.querySelector(eggBtn).addEventListener('click', filterMoves);
    document.querySelector(machineBtn).addEventListener('click', filterMoves);
    document.querySelector(nav).addEventListener('click', loadNewPokemon);
  }

  function filterMoves(e) {
    document.querySelector('.move-filter').classList.remove('move-filter');
    const method = e.target.closest('.btn').id;
    document.querySelector(`#${method}`).classList.add('move-filter');
    UICtrl.displayMoves(pokemon.moves[method]);
  }

  function loadNewPokemon(e) {
    const dexID = e.target.getAttribute('data-dexID');
    if (dexID) {
      sessionStorage.setItem('currentDexID', dexID);
      location.reload();
    }
  }
  return {
    init: async function () {
      // Authenticate
      const dexID = sessionStorage.getItem('currentDexID');
      pokemon = await getPokemon(dexID);
      UICtrl.render(pokemon);
      loadEventListeners();
    },
  };
})(UICtrl);

AppCtrl.init();
