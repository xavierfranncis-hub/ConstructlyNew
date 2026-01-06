const mongoose = require('mongoose');

const builderSchema = new mongoose.Schema({
    id: { type: Number }, // For consistency with session storage
    name: { type: String, required: true },
    rating: { type: Number, default: 0 },
    expertise: [String],
    location: { type: String, required: true },
    phone: { type: String },
    portfolio: [String],
    verified: { type: Boolean, default: false }
});

module.exports = mongoose.model('Builder', builderSchema);
