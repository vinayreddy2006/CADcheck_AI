const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
  title: String,
  severity: String,
  type: { type: String }, // type is a reserved mongoose keyword if used as object key, so obj structure is safer
  rule: String,
  confidence: String,
  fix: String
});

const projectSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  cadFileUrl: { type: String },
  status: { type: String, enum: ['pending', 'processing', 'completed'], default: 'pending' },
  validationScore: { type: String, default: '0%' },
  issues: [issueSchema],
  stats: {
    totalNodes: { type: Number, default: 0 },
    edges: { type: Number, default: 0 },
    volume: { type: String, default: '0 cm³' },
    density: { type: String, default: '0 g/cm³' }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Project', projectSchema, 'projects');
