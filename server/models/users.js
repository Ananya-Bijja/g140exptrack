const mongoose = require('mongoose');
const GameSession = require('./gameSession'); // Import the gameSession model

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  emotionAnalysis: [{ type: mongoose.Schema.Types.ObjectId, ref: 'GameSession' }] // Reference to GameSession model
});

module.exports = mongoose.model('User', userSchema);
