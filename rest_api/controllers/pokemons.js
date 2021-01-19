const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Pokemon = require('../models/Pokemon');
const Team = require('../models/Team');

// @desc    Get Pokemons
// @route   GET /api/v1/pokemons
// @route   GET /api/v1/teams/:teamId/pokemons
// @access  Private
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

// @desc    Get Single Pokemon
// @route   GET /api/v1/pokemons/:id
// @access  Private
exports.getPokemon = asyncHandler(async (req, res, next) => {
  const pokemon = await Pokemon.findById(req.params.id).populate({
    path: 'team',
    select: 'name',
  });

  if (!pokemon) {
    return next(
      new ErrorResponse(`No course with the id of ${req.params.id}`),
      404
    );
  }

  res.status(200).json({ success: true, data: pokemon });
});

// @desc    Create Pokemon
// @route   POST /api/v1/teams/:teamId/pokemons
// @access  Private
exports.createPokemon = asyncHandler(async (req, res, next) => {
  // Check if team exists
  req.body.team = req.params.teamId;

  const team = await Team.findById(req.params.teamId);
  if (!team) {
    return next(
      new ErrorResponse(
        `No team exists with the id of ${req.params.teamId}`,
        404
      )
    );
  }
  const pokemon = await Pokemon.create(req.body);

  res.status(200).json({ success: true, data: pokemon });
});

// @desc    Update Pokemon
// @route   PUT /api/v1/pokemons/:id
// @access  Private
exports.updatePokemon = asyncHandler(async (req, res, next) => {
  const pokemon = await Pokemon.findByIdAndUpdate(req.params.id);

  if (!pokemon) {
    return next(
      new ErrorResponse(`No course with the id of ${req.params.id}`),
      404
    );
  }

  res.status(200).json({ success: true, data: pokemon });
});

// @desc    Update Pokemon
// @route   PUT /api/v1/pokemons/:id
// @access  Private
exports.updatePokemon = asyncHandler(async (req, res, next) => {
  let pokemon = await Pokemon.findById(req.params.id);

  if (!pokemon) {
    return next(
      new ErrorResponse(`No pokemon with the id of ${req.params.id}`),
      404
    );
  }

  pokemon = await Pokemon.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ success: true, data: pokemon });
});

// @desc    Delete Pokemon
// @route   DELETE /api/v1/pokemons/:id
// @access  Private
exports.deletePokemon = asyncHandler(async (req, res, next) => {
  const pokemon = await Pokemon.findById(req.params.id);

  if (!pokemon) {
    return next(
      new ErrorResponse(`No pokemon with the id of ${req.params.id}`),
      404
    );
  }

  await pokemon.remove();
  res.status(200).json({ success: true, data: {} });
});
