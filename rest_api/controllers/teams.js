// @desc      Get All Teams
// @route     GET /api/v1/teams
// @access    Private
exports.getTeams = (req, res, next) => {
  res.status(200).json({ success: true, msg: 'Show all teams' });
};

// @desc      Get single Team
// @route     GET /api/v1/teams/:id
// @access    Private
exports.getTeam = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `Get team with id ${req.params.id}` });
};

// @desc      Create a single Team
// @route     POST /api/v1/teams/:id
// @access    Private
exports.createTeam = (req, res, next) => {
  res.status(200).json({ success: true, msg: 'Create new team' });
};

// @desc      Update Team
// @route     POST /api/v1/teams/:id
// @access    Private
exports.updateTeam = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `Update team with id ${req.params.id}` });
};

// @desc      Delete Team
// @route     DELETE /api/v1/teams/:id
// @access    Private
exports.deleteTeam = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `Delete team with id ${req.params.id}` });
};
