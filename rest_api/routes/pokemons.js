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

router.route('/').get(protect, getPokemons).post(protect, createPokemon);
router
  .route('/:id')
  .get(protect, getPokemon)
  .put(protect, updatePokemon)
  .delete(protect, deletePokemon);

module.exports = router;
