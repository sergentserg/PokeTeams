const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');

// Protect routes (allow only authenticated users).
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  // if (
  //   req.headers.authorization &&
  //   req.headers.authorization.startsWith('Bearer ')
  // ) {
  //   token = req.headers.authorization.split(' ')[1];
  // } else
  if (req.cookies.token) {
    token = req.cookies.token;
  }

  // Make sure token exists.
  if (!token) {
    return next(
      new ErrorResponse('Not authorized to access this resource.', 401)
    );
  }

  try {
    // Verify token and set user in request object.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Invalid token or expired token?
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(
        new ErrorResponse('Not authorized to access this resource.', 401)
      );
    }
    req.user = user;
    next();
  } catch (err) {
    return next(
      new ErrorResponse('Not authorized to access this resource.', 401)
    );
  }
});

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role ${req.user.role} is forbidden from accessing this route.`,
          403
        )
      );
    }
    next();
  };
};
