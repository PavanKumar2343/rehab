const express = require('express');
const router = express.Router();
const {
  registerUser,
  registerShelter,
  registerAdmin,
  login,
  getMe,
  updateProfile,
  googleAuth
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/register', registerUser);
router.post('/register-shelter', registerShelter);
router.post('/register-admin', registerAdmin);
router.post('/login', login);
router.post('/google', googleAuth);

router.get('/me', protect, getMe);
router.put('/update', protect, upload.single('profilePhoto'), updateProfile);

module.exports = router;
