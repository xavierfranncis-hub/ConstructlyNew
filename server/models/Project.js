const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    id: { type: Number }, // For consistency with session storage
    title: { type: String, required: true },
    builder: { type: String, required: true }, // Ideally a reference to Builder ID
    progress: { type: Number, default: 0 },
    status: { type: String, default: 'Pending' },
    lastUpdate: { type: String, default: 'Just now' },
    isHired: { type: Boolean, default: false },
    startDate: { type: Date },
    estimatedEndDate: { type: Date },
    contractAmount: { type: Number },
    category: { type: String }, // e.g. "Architect", "Masonry"
    progressPhotos: { type: [String], default: [] },
    location: { type: String },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Project', projectSchema);
