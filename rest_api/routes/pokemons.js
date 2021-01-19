const express = require('express');
const { getPokemons } = require('../controllers/pokemons');

// Merge parameters from parent router (in this case, teams router).
const router = express.Router({ mergeParams: true });

router.route('/').get(getPokemons);

module.exports = router;
