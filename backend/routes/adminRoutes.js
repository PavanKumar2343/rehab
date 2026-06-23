const express = require('express');
const router = express.Router();
const {
  getUsers,
  deleteUser,
  getPendingShelters,
  getSheltersAdmin,
  verifyShelter,
  getAnalytics,
  generateReport
} = require('../controllers/adminController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

// Lock down all routes to admin
router.use(protect, restrictTo('admin'));

router.get('/users', getUsers);
router.delete('/users/:id', deleteUser);
router.get('/shelters', getSheltersAdmin);
router.get('/shelters/pending', getPendingShelters);
router.put('/shelters/:id/verify', verifyShelter);
router.get('/analytics', getAnalytics);
router.get('/report-generate', generateReport);

module.exports = router;
