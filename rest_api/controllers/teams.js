const Team = require('../models/Team');

// @desc      Get All Teams
// @route     GET /api/v1/teams
// @access    Private
exports.getTeams = async (req, res, next) => {
  try {
    const teams = await Team.find();

    res.status(200).json({ success: true, data: teams, count: teams.length });
  } catch (error) {
    res.status(400).json({ success: false });
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
      return res.status(400).json({ success: false });
    }

    res.status(200).json({ success: true, data: team });
  } catch (error) {
    // Incorrectly formatted ID.
    res.status(400).json({ success: false });
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
  } catch (error) {
    res.status(400).json({ success: false });
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
      return res.status(400).json({ success: true });
    }
    res.status(200).json({ success: true, data: team });
  } catch (error) {
    res.status(400).json({ success: true });
  }
};

// @desc      Delete Team
// @route     DELETE /api/v1/teams/:id
// @access    Private
exports.deleteTeam = async (req, res, next) => {
  try {
    const team = await Team.findByIdAndDelete(req.params.id);

    if (!team) {
      return res.status(400).json({ success: true });
    }

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: true });
  }
};
