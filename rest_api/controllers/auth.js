const ErrorResponse = require('../utils/errorResponse');
const async = require('../middleware/async');
const User = require('../models/User');
const asyncHandler = require('../middleware/async');

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
  });

  sendTokenResponse(user, 200, res);
});

// @desc    Login user
// @route   POST /api/v1/auth/register
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email and password.
  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400));
  }

  // Check for user; explicitly requests password (defaults to not returning it).
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(
      new ErrorResponse('The credentials provided were invalid.', 401)
    );
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(
      new ErrorResponse('The credentials provided were invalid.', 401)
    );
  }

  sendTokenResponse(user, 200, res);
});

// Get token from model, create cookie, and send response.
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  // Assumes days in JWT_COOKIE_EXPIRE.
  // httpOnly so cookie is accessed only in client side script.
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' ? true : false,
  };

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({ success: true, token });
};

// @desc    Get current logged in user
// @route   POST /api/v1/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    data: req.user,
  });
});
