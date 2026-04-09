const express = require('express');
const { analyzeProject, generateGraph, validateProject } = require('../controllers/ai.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/analyze', protect, analyzeProject);
router.post('/generate-graph', protect, generateGraph);
router.post('/validate', protect, validateProject);

module.exports = router;
