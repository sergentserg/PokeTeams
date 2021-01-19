const express = require('express');
const {
  getPokemons,
  getPokemon,
  createPokemon,
  updatePokemon,
  deletePokemon,
} = require('../controllers/pokemons');

// Merge parameters from parent router (in this case, teams router).
const router = express.Router({ mergeParams: true });

router.route('/').get(getPokemons).post(createPokemon);
router.route('/:id').get(getPokemon).put(updatePokemon).delete(deletePokemon);

module.exports = router;
