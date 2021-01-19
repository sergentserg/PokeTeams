const express = require('express');
const {
  getTeams,
  getTeam,
  createTeam,
  updateTeam,
  deleteTeam,
} = require('../controllers/teams');
const pokemonsRouter = require('./pokemons');

const router = express.Router();

// Reroute
router.use('/:teamId/pokemons', pokemonsRouter);

router.route('/').get(getTeams).post(createTeam);
router.route('/:id').get(getTeam).put(updateTeam).delete(deleteTeam);
module.exports = router;
