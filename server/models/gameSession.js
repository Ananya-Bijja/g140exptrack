const mongoose = require('mongoose');
const Image = require('./image');
const Screenshot = require('./screenshot');

const gameSessionSchema = new mongoose.Schema({
  gameSessionId: { type: String, required: true },
  images: [Image.schema],
  screenshots: [Screenshot.schema],
  flag: { type: Boolean, default: false, required: true }
});

module.exports = mongoose.model('GameSession', gameSessionSchema);
