const express = require('express');
const { createProject, getProjects, getProject, deleteProject, uploadCAD } = require('../controllers/project.controller');
const { protect } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

const router = express.Router();

router.route('/')
  .post(protect, createProject)
  .get(protect, getProjects);

router.route('/:id')
  .get(protect, getProject)
  .delete(protect, deleteProject);

router.post('/:id/upload', protect, upload.single('cadFile'), uploadCAD);

module.exports = router;
