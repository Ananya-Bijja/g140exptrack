const mongoose = require('mongoose');
const GameSession = require('./gameSession');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  role: { type: String, default: "child" },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  gameSessions: [GameSession.schema],
});

module.exports = mongoose.model('User', userSchema);
