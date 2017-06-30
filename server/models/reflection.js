const mongoose = require('mongoose');

var Reflection = mongoose.model('Reflection', {
  mindfulnessScore: Number,
  text: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  habits: {
    sleep: Boolean,
    exercise: Boolean,
    diet: Boolean,
    meditation: Boolean
  },
  completedAt: {
    type: Number,
    default: null
  },
  _creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
});

module.exports = {Reflection};
