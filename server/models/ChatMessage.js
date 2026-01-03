const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    roomId: { type: String, required: true },
    text: { type: String, required: true },
    sender: { type: String, required: true }, // 'me' or 'them' (or userId)
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ChatMessage', chatSchema);
