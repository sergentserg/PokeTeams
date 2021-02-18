// Global Constants
const MAX_MOVES = 813;

const MOVES_URL = `https://pokeapi.co/api/v2/move?limit=${MAX_MOVES}`;
const MOVE_PRIORITY_COUNT = 13;
const SLOWEST_MOVE = -7;

// Utility Functions
function debounce(fn, ms) {
  let timer = 0;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(fn.bind(this, ...args), ms || 0);
  };
}

const sidenavToggler = document.querySelector('#sidenavToggler');
if (sidenavToggler) {
  sidenavToggler.addEventListener('click', () => {
    document.querySelector('.side-nav').classList.toggle('show-sidenav');
  });
}
