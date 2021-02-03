const path = require('path');
const crypto = require('crypto');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmails');
const asyncHandler = require('../utils/async');

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
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/auth/resetpassword/${resetToken}`;
  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetURL}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'PokeTeams password reset token',
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

  sendTokenResponse(user, 200, res);
});

// @desc    Update user details
// @route   PUT /api/v1/auth/updatedetails
// @access  Private
exports.updateDetails = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email,
  };
  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

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

  // Create unique photo name.
  file.name = `photo_${req.user.id}${path.parse(file.name).ext}`;

  // Move file to photo folder.
  file.mv(
    path.join(
      process.env.PROJECT_DIR,
      process.env.PUBLIC_DIR,
      process.env.FILE_UPLOAD_DIR,
      file.name
    ),
    async (err) => {
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
    }
  );
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
