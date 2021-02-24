const mongoose = require('mongoose');

const PokemonSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, 'Please include Pokemon name.'],
  },
  dexID: {
    type: String,
    trim: true,
    required: [true, 'Please include dexID'],
  },
  nick: {
    type: String,
    trim: true,
    maxlength: [50, 'Nick can be at most 50 characters.'],
  },
  ability: {
    type: String,
    trim: true,
  },
  item: {
    type: String,
    trim: true,
  },
  moves: {
    type: [String],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  team: {
    type: mongoose.Schema.ObjectId,
    ref: 'Team',
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
});

module.exports = mongoose.model('Pokemon', PokemonSchema);
