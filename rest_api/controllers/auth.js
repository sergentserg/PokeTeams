const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmails');
const asyncHandler = require('../utils/async');

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.create({
    name: email,
    email,
    password,
  });
  const emailToken = user.getEmailVerifyToken();
  await user.save();

  // const verifyUrl = `${req.protocol}://${req.get(
  //   'origin'
  // )}/auth.html?emailtoken=${emailToken}`;
  const verifyUrl = `${req.get('origin')}/auth.html?emailtoken=${emailToken}`;

  const message = `Hello,\n\nYou are receiving this email because you (or someone else) have decided to create a PokeTeams account. Please click on the following link to confirm your email before you can start using your account:\n\n${verifyUrl}\n\nIf you did not initiate this request, please ignore this email.\n\nBest,\nPokeTeams`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'PokeTeams Email Verification - DO NOT REPLY',
      message,
    });
    res.status(200).json({ success: true, data: 'Email sent.' });
  } catch (err) {
    await user.delete();

    return next(new ErrorResponse(`Email could not be sent.`, 500));
  }
});

// @desc    Verify User Email
// @route   PUT /api/v1/auth/verify/:emailToken
// @access  Public
exports.verifyEmail = asyncHandler(async (req, res, next) => {
  // Get hashed token.
  const emailVerifyToken = crypto
    .createHash('sha256')
    .update(req.params.emailToken)
    .digest('hex');

  const user = await User.findOne({
    emailVerifyToken,
    emailVerifyExpire: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ErrorResponse('Invalid token', 400));
  }

  // Activate account.
  user.active = true;
  user.emailVerifyToken = undefined;
  user.emailVerifyExpire = undefined;
  await user.save();

  res.status(200).json({ success: true });
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
  const user = await User.findOne({ email: email }).select('+password');

  if (!user) {
    return next(
      new ErrorResponse('The credentials provided were invalid.', 401)
    );
  }

  if (!user.active) {
    return next(new ErrorResponse('Inactive account.', 401));
  }

  // Check if password matches.
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(
      new ErrorResponse('The credentials provided were invalid.', 401)
    );
  }

  sendTokenResponse(user, 200, res);
});

// @desc    Get current logged in user
// @route   POST /api/v1/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    data: req.user,
  });
});

// @desc    Log user out by clearing cookie
// @route   GET /api/v1/auth/logout
// @access  Private
exports.logout = asyncHandler(async (req, res, next) => {
  res.clearCookie('token');
  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Forgot password
// @route   POST /api/v1/auth/forgotpassword
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorResponse(`There is no user with that email.`, 404));
  }

  // Get reset token.
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  // Create reset url.
  // const resetURL = `${req.protocol}://${req.get(
  //   'origin'
  // )}/auth.html?resettoken=${resetToken}`;
  // const message = `Hello,\nYou are receiving this email because you (or someone else) has requested the reset of a password. Please click on the following URL to reset your PokeTeams password: \n\n ${resetURL}\n\nIf you did not request this reset, please ignore this email.\n\nBest,\nPokeTeams`;
  const resetURL = `${req.get('origin')}/auth.html?resettoken=${resetToken}`;
  const message = `Hello,\n\nYou are receiving this email because you (or someone else) has requested the reset of a password. Please click on the following URL to reset your PokeTeams password: \n\n ${resetURL}\n\nIf you did not request this reset, please ignore this email.\n\nBest,\nPokeTeams`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'PokeTeams Password Reset - DO NOT REPLY',
      message,
    });
    res.status(200).json({ success: true, data: 'Email sent.' });
  } catch (err) {
    console.log(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new ErrorResponse(`Email could not be sent.`, 500));
  }
});

// @desc    Reset password
// @route   PUT /api/v1/auth/resetpassword/:resettoken
// @access  Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // Get hashed token.
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ErrorResponse('Invalid token', 400));
  }

  // Set new password.
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.status(200).json({ success: true, data: 'Email sent.' });
});

// @desc    Update user details
// @route   PUT /api/v1/auth/updatedetails
// @access  Private
exports.updateDetails = asyncHandler(async (req, res, next) => {
  console.log(req.body);
  const fieldsToUpdate = {
    name: req.body.name,
    // email: req.body.email,
  };
  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  console.log(user);

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc    Update Password
// @route   PUT /api/v1/auth/updatepassword
// @access  Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  // Check current password.
  if (!(await user.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse('Incorrect password', 401));
  }

  user.password = req.body.newPassword;
  await user.save();

  sendTokenResponse(user, 200, res);
});

// @desc      Upload photo for user
// @route     PUT /api/v1/auth/photoupload
// @access    Private
exports.userPhotoUpload = asyncHandler(async (req, res, next) => {
  // Check if file has been uploaded.
  console.log(req.files);
  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file.`, 400));
  }

  const file = req.files.file;

  // Image must be a photo.
  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse(`Please upload an image file.`, 400));
  }

  // 1 MB max for photo uploads.
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${
          process.env.MAX_FILE_UPLOAD / (1024 * 1024)
        } MB.`,
        400
      )
    );
  }

  // Create unique photo name; append timestamp to prevent caching issues.
  file.name = `photo_${req.user.id}${Date.now()}${path.parse(file.name).ext}`;

  const uploadsPath = path.join(
    process.env.PROJECT_DIR,
    process.env.PUBLIC_DIR,
    process.env.FILE_UPLOAD_DIR
  );
  // Delete old file.
  fs.readdirSync(uploadsPath)
    .filter((f) => f.startsWith(`photo_${req.user.id}`))
    .map((f) => fs.unlinkSync(path.join(uploadsPath, f)));

  // Move new file to photo folder.
  file.mv(path.join(uploadsPath, file.name), async (err) => {
    if (err) {
      return next(new ErrorResponse(`Unable to upload file`, 500));
    }

    await User.findByIdAndUpdate(
      req.user.id,
      { photo: file.name },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({ success: true, photo: file.name });
  });
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
    .json({ success: true });
  // .json({ success: true, token });
};
