const mongoose = require('mongoose');
const slugify = require('slugify');

const TeamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please include a team name.'],
    unique: true,
    trim: true,
    maxlength: [50, 'Team name can be at most 25 characters.'],
  },
  slug: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create team slug from the name
TeamSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

module.exports = mongoose.model('Teams', TeamSchema);
