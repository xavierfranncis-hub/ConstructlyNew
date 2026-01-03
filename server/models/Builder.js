const mongoose = require('mongoose');

const builderSchema = new mongoose.Schema({
    name: { type: String, required: true },
    rating: { type: Number, default: 0 },
    expertise: [String],
    location: { type: String, required: true },
    verified: { type: Boolean, default: false }
});

module.exports = mongoose.model('Builder', builderSchema);
