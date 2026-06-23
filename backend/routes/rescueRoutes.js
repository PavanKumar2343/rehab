const express = require('express');
const router = express.Router();
const {
  getIncomingRescues,
  getActiveRescues,
  acceptRescue,
  rejectRescue,
  updateRescueStatus,
  getRescueById,
  getMyRescueHistory
} = require('../controllers/rescueController');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/incoming', protect, restrictTo('shelter'), getIncomingRescues);
router.get('/active', protect, restrictTo('shelter'), getActiveRescues);
router.get('/my-history', protect, getMyRescueHistory);
router.get('/:id', protect, getRescueById);

router.put('/:id/accept', protect, restrictTo('shelter'), acceptRescue);
router.put('/:id/reject', protect, restrictTo('shelter'), rejectRescue);
router.put('/:id/status', protect, restrictTo('shelter'), upload.single('photo'), updateRescueStatus);

module.exports = router;
