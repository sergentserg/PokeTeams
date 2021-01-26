const express = require('express');
const {
  getTeams,
  getTeam,
  createTeam,
  updateTeam,
  deleteTeam,
} = require('../controllers/teams');
const pokemonsRouter = require('./pokemons');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Reroute
router.use('/:teamId/pokemons', pokemonsRouter);

router.route('/').get(protect, getTeams).post(protect, createTeam);
router
  .route('/:id')
  .get(protect, getTeam)
  .put(protect, updateTeam)
  .delete(protect, deleteTeam);
module.exports = router;
