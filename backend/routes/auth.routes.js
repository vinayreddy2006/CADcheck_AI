const express = require('express');
const { registerUser, loginUser, logoutUser, getUserProfile, changePassword } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.route('/me').get(protect, getUserProfile);
router.route('/change-password').put(protect, changePassword);

module.exports = router;
