const Team = require('../models/Team');
const ErrorResponse = require('../utils/errorResponse');

// @desc      Get All Teams
// @route     GET /api/v1/teams
// @access    Private
exports.getTeams = async (req, res, next) => {
  try {
    const teams = await Team.find();

    res.status(200).json({ success: true, data: teams, count: teams.length });
  } catch (err) {
    next(err);
  }
};

// @desc      Get single Team
// @route     GET /api/v1/teams/:id
// @access    Private
exports.getTeam = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.id);

    // Correctly formatted ID: no result found. End cycle via return.
    if (!team) {
      return next(
        new ErrorResponse(`Team not found with id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({ success: true, data: team });
  } catch (err) {
    // Incorrectly formatted ID.
    next(err);
  }
};

// @desc      Create a single Team
// @route     POST /api/v1/teams/:id
// @access    Private
exports.createTeam = async (req, res, next) => {
  try {
    const team = await Team.create(req.body);

    res.status(201).json({
      success: true,
      data: team,
    });
  } catch (err) {
    next(err);
  }
};

// @desc      Update Team
// @route     POST /api/v1/teams/:id
// @access    Private
exports.updateTeam = async (req, res, next) => {
  try {
    const team = await Team.findByIdAndUpdate(req.params.id, req.body, {
      // team is the new (updated) data from the body.
      new: true,
      runValidators: true,
    });

    if (!team) {
      return next(
        new ErrorResponse(`Team not found with id of ${req.params.id}`, 404)
      );
    }
    res.status(200).json({ success: true, data: team });
  } catch (err) {
    next(err);
  }
};

// @desc      Delete Team
// @route     DELETE /api/v1/teams/:id
// @access    Private
exports.deleteTeam = async (req, res, next) => {
  try {
    const team = await Team.findByIdAndDelete(req.params.id);

    if (!team) {
      return next(
        new ErrorResponse(`Team not found with id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};
