// // models/feedback.js
// const mongoose = require('mongoose');

// const feedbackSchema = new mongoose.Schema({
//   feedbackText: { type: String, required: true },
//   rating: { type: Number, required: true, min: 1, max: 5 },
//   submittedAt: { type: Date, default: Date.now },
// });

// const Feedback = mongoose.model('Feedback', feedbackSchema);

// module.exports = Feedback;
const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  feedbackText: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  submittedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Feedback', feedbackSchema);