const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Pokemon = require('../models/Pokemon');

// @desc    Get Pokemons
// @route   Get /api/v1/pokemons
// @route   GET /api/v1/teams/:teamId/pokemons
// @access  Public
exports.getPokemons = asyncHandler(async (req, res, next) => {
  let query;

  if (req.params.teamId) {
    query = Pokemon.find({ team: req.params.teamId });
  } else {
    query = Pokemon.find().populate({
      path: 'team',
      select: 'name',
    });
  }

  const pokemons = await query;
  res
    .status(200)
    .json({ success: true, count: pokemons.length, data: pokemons });
});
