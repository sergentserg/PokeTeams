const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A team needs a name.'],
    unique: true,
    trim: true,
    maxlength: [25, 'Team name can be at most 25 characters.'],
  },
  slug: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Teams', TeamSchema);
