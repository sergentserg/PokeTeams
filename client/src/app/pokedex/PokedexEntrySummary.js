import { POKE_SPRITE_URL } from 'src/shared/util/constants';
import { capitalize } from 'src/shared/util/capitalize';

export default function PokedexEntrySummary(data) {
  const summary = document.createElement('div');
  summary.classList = 'border';
  summary.id = 'summaryCard';

  const teamSelectAdd = document.createElement('div');
  teamSelectAdd.classList = 'd-flex';
  summary.append(teamSelectAdd);

  // Team select: load based on teams.
  const teamSelect = document.createElement('select');
  teamSelect.classList = 'form-control';
  teamSelectAdd.append(teamSelect);

  const selectHeader = document.createElement('option');
  selectHeader.selected = true;
  selectHeader.disabled = true;
  selectHeader.hidden = true;
  selectHeader.textContent = 'Choose a team';
  teamSelect.append(selectHeader);
  // For now, load filler options.
  ['A', 'B', 'C'].forEach((team) => {
    const teamOption = document.createElement('option');
    teamOption.value = `team${team}`;
    teamOption.textContent = `Team ${team}`;
    teamSelect.append(teamOption);
  });

  const teamSelectAddBtn = document.createElement('button');
  teamSelectAddBtn.classList = 'btn';
  teamSelectAddBtn.innerHTML = `<i class="fas fa-plus-circle"></i>`;
  teamSelectAdd.append(teamSelectAddBtn);

  // Favorite + Gender
  const miscControls = document.createElement('div');
  miscControls.classList = 'd-flex justify-content-between';
  summary.append(miscControls);

  const genderBtn = document.createElement('button');
  genderBtn.classList = 'btn';
  genderBtn.innerHTML = `<i class="fas fa-venus text-danger"></i>`;
  miscControls.append(genderBtn);

  const favBtn = document.createElement('button');
  favBtn.classList = 'btn';
  favBtn.innerHTML = `<i class="far fa-heart"></i>`;
  miscControls.append(favBtn);

  // Sprite
  const sprite = document.createElement('div');
  sprite.classList = 'd-flex justify-content-center';
  sprite.innerHTML = `
    <img src="${POKE_SPRITE_URL}/${data.dexID}.png" alt="${data.name}"/>
  `;
  summary.append(sprite);

  // Name
  const name = document.createElement('h4');
  name.classList = 'text-center';
  name.textContent = data.name;
  summary.append(name);

  // Types
  const types = document.createElement('div');
  types.classList = `d-flex justify-content-center py-2 border-top bg-secondary`;
  let content = '';
  data.types.forEach((slot) => {
    const type = slot.type.name;
    content += `<small class="type-${type} mx-1">${capitalize(type)}</small>`;
  });
  types.innerHTML = content;
  summary.append(types);

  // Pokedex Number, height, and weight.
  const miscDetails = document.createElement('div');
  miscDetails.classList = 'text-center';
  miscDetails.innerHTML = `
    <div class="d-flex justify-content-around border-bottom">
      <strong class="border-right w-100 flex-grow">
        Pokédex No.
      </strong>
      <span class="w-100 flex-grow">${data.dexID}</span>
    </div>
    <div class="d-flex justify-content-around border-bottom">
      <strong class="border-right w-100 flex-grow">Height</strong>
      <span id="height" class="w-100 flex-grow">${10 * data.height} cm</span>
    </div>
    <div class="d-flex justify-content-around">
      <strong class="border-right w-100 flex-grow">Weight</strong>
      <span id="weight" class="w-100 flex-grow">${100 * data.weight} g</span>
    </div>
  `;
  summary.append(miscDetails);
  return summary;
}
