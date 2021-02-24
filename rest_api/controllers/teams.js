const Team = require('../models/Team');
const asyncHandler = require('../utils/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc      Get All Teams
// @route     GET /api/v1/teams
// @access    Private
exports.getTeams = asyncHandler(async (req, res, next) => {
  const teams = await Team.find({ user: req.user.id }).populate({
    path: 'pokemons',
  });
  res.status(200).json({ success: true, count: teams.length, data: teams });
});

// @desc      Get single Team
// @route     GET /api/v1/teams/:id
// @access    Private
exports.getTeam = asyncHandler(async (req, res, next) => {
  const team = await Team.findOne({
    _id: req.params.id,
    user: req.user.id,
  }).populate({
    path: 'pokemons',
  });
  console.log(team);
  // Correctly formatted ID: no result found. End cycle via return.
  if (!team) {
    return next(new ErrorResponse(`Resource not found.`, 404));
  }

  if (team.user.toString() != req.user.id) {
    return next(
      new ErrorResponse(`Not authorized to access this resource.`, 403)
    );
  }

  res.status(200).json({ success: true, data: team });
});

// @desc      Create a single Team
// @route     POST /api/v1/teams/:id
// @access    Private
exports.createTeam = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.user = req.user.id;

  // Check for max number of teams.
  const teams = await Team.find({ user: req.user.id });
  if (teams && teams.length >= process.env.MAX_USER_TEAMS) {
    return next(
      new ErrorResponse(
        `The user with id ${req.user.id} has reached the limit on the number of teams`,
        400
      )
    );
  }

  const team = await Team.create(req.body);

  res.status(201).json({
    success: true,
    data: team,
  });
});

// @desc      Update Team
// @route     PUT /api/v1/teams/:id
// @access    Private
exports.updateTeam = asyncHandler(async (req, res, next) => {
  // Ensure resource exists.
  let team = await Team.findOne({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!team) {
    return next(new ErrorResponse('Resource not found', 404));
  }

  team = await Team.findByIdAndUpdate(req.params.id, req.body, {
    // team is the new (updated) data from the body.
    new: true,
    runValidators: true,
  }).populate({
    path: 'pokemons',
  });
  res.status(200).json({ success: true, data: team });
});

// @desc      Delete Team
// @route     DELETE /api/v1/teams/:id
// @access    Private
exports.deleteTeam = asyncHandler(async (req, res, next) => {
  const team = await Team.findOne({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!team) {
    return next(new ErrorResponse('Resource not found', 404));
  }
  team.remove();

  res.status(200).json({ success: true, data: {} });
});
