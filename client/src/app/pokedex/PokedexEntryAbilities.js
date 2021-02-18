import { capitalize } from 'src/shared/util/capitalize';

export default function PokedexEntryAbilities(abilities) {
  const abilitiesCard = document.createElement('div');
  abilitiesCard.classList = 'card';

  const header = document.createElement('div');
  header.classList = 'card-header bg-danger text-white';
  header.innerHTML = `
    <h5>
      <a
        href="#abilities"
        data-parent="#detailsAccordion"
        data-toggle="collapse"
      >
        <i class="fas fa-angle-right"></i> Abilities
      </a>
    </h5>
  `;
  abilitiesCard.append(header);

  const abilitiesCollapse = document.createElement('div');
  abilitiesCollapse.classList = 'collapse';
  abilitiesCollapse.id = 'abilities';
  abilitiesCard.append(abilitiesCollapse);

  const abilitiesBody = document.createElement('div');
  abilitiesBody.classList = 'body';
  abilitiesCollapse.append(abilitiesBody);

  const abilitiesList = document.createElement('ul');
  abilitiesList.classList = 'list-group';
  abilitiesBody.append(abilitiesList);

  abilities.forEach((slot) => {
    fetch(slot.ability.url)
      .then((res) => res.json())
      .then((data) => {
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
        abilitiesList.append(li);
      });
  });
  return abilitiesCard;
}
