const mongoose = require('mongoose');

const validationSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  results: { type: Object, required: true },
  confidence: { type: Number, required: true },
  timestamps: {
    startedAt: { type: Date },
    completedAt: { type: Date }
  }
});

module.exports = mongoose.model('Validation', validationSchema, 'validations');
