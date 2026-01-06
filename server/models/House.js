const mongoose = require('mongoose');

const houseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    price: { type: Number, required: true },
    type: { type: String, enum: ['New', 'Old'], default: 'New' },
    description: { type: String },
    location: { type: String, required: true },
    images: { type: [String], default: [] },
    sellerPhone: { type: String, required: true },
    sellerName: { type: String },
    isSold: { type: Boolean, default: false },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('House', houseSchema);
