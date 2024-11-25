const mongoose = require('mongoose');
     const Image = require('./image'); // Import the image model

     const gameSessionSchema = new mongoose.Schema({
       gameSessionId: { type: String, required: true },
       images: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Image' } ], // Reference to Image model
     });

     module.exports = mongoose.model('GameSession', gameSessionSchema);
     
