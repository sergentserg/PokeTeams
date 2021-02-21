const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    required: [true, 'Please add an email.'],
    unique: true,
    match: [
      /^\S+@\S+\.\S+$/,
      'Please verify the email is formatted correctly.',
    ],
  },
  password: {
    type: String,
    required: [true, 'Please add a password.'],
    minlength: 8,
    select: false,
  },
  active: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    default: 'user',
  },
  photo: {
    type: String,
    default: 'no-photo.png',
  },
  emailVerifyToken: String,
  emailVerifyExpire: Date,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Encrypt user's password with bcryptjs.
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Cascade delete teams when a user is deleted.
UserSchema.pre(
  /^(delete|remove)/,
  { document: true, query: false },
  async function (next) {
    await this.model('Team').deleteMany({ user: this._id });
    next();
  }
);

// Sign JWT and return.
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Match user entered password to hashed password in database.
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash email token.
UserSchema.methods.getEmailVerifyToken = function () {
  // Generate the token.
  const emailToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field.
  this.emailVerifyToken = crypto
    .createHash('sha256')
    .update(emailToken)
    .digest('hex');

  // Set the expire field. (1 day).
  this.emailVerifyExpire = Date.now() + 1440 * 60 * 1000;
  // Unhashed token sent back to client.
  return emailToken;
};

// Generate and hash password token.
UserSchema.methods.getResetPasswordToken = function () {
  // Generate the token.
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field.
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set the expire field. (10 minutes).

  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  // Unhashed token sent back to client.
  return resetToken;
};

module.exports = mongoose.model('User', UserSchema);
