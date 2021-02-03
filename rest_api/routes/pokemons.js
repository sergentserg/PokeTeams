const express = require('express');
const {
  getPokemons,
  getPokemon,
  createPokemon,
  updatePokemon,
  deletePokemon,
} = require('../controllers/pokemons');
const { protect } = require('../middleware/auth');

// Merge parameters from parent router (in this case, teams router).
const router = express.Router({ mergeParams: true });

router.use(protect);

router.route('/').get(getPokemons).post(createPokemon);
router.route('/:id').get(getPokemon).put(updatePokemon).delete(deletePokemon);

module.exports = router;
