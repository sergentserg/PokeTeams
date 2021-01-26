const mongoose = require('mongoose');
const slugify = require('slugify');

const TeamSchema = new mongoose.Schema(
  {
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
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Create team slug from the name
TeamSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// Cascade delete pokemons when a team is deleted
TeamSchema.pre('remove', async function (next) {
  console.log(`Pokemons being removed from team ${this._id}`);
  await this.model('Pokemon').deleteMany({ team: this._id });
  next();
});

// Reverse populate with virtuals
TeamSchema.virtual('pokemons', {
  ref: 'Pokemon',
  localField: '_id',
  foreignField: 'team',
  justOne: false,
});

module.exports = mongoose.model('Team', TeamSchema);
