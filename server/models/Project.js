const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    builder: { type: String, required: true }, // Ideally a reference to Builder ID
    progress: { type: Number, default: 0 },
    status: { type: String, default: 'Pending' },
    lastUpdate: { type: String, default: 'Just now' },
    isHired: { type: Boolean, default: false },
    startDate: { type: Date },
    estimatedEndDate: { type: Date },
    contractAmount: { type: Number },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Project', projectSchema);
