const mongoose = require('mongoose');

const quotationSchema = new mongoose.Schema({
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    builderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Builder', required: true },
    estimatedCost: { type: Number, required: true },
    timeline: { type: String, required: true }, // e.g. "30 days" or "3 weeks"
    notes: { type: String },
    status: {
        type: String,
        enum: ['Pending', 'Sent', 'Accepted', 'Rejected'],
        default: 'Sent'
    },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Quotation', quotationSchema);
