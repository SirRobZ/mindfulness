const mongoose = require('mongoose');

var Reflection = mongoose.model('Reflection', {
  mindfulnessScore: Number,
  observeScore: Number,
  describeScore: Number,
  actingScore: Number,
  nonjudgingScore: Number,
  nonreactScore: Number,
  text: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  habits: [{
    type: String,
    enum: ['sleep', 'exercise', 'diet', 'meditation']
  }],
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
