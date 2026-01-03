const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    builder: { type: String, required: true }, // Ideally a reference to Builder ID
    progress: { type: Number, default: 0 },
    status: { type: String, default: 'Pending' },
    lastUpdate: { type: String } // String for now, can be Date
});

module.exports = mongoose.model('Project', projectSchema);
