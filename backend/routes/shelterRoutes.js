const express = require('express');
const router = express.Router();
const {
  getShelters,
  getShelterById,
  getNearbyShelters,
  updateRadiusPreference
} = require('../controllers/shelterController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

router.get('/', getShelters);
router.get('/nearby', getNearbyShelters);
router.get('/:id', getShelterById);

router.put('/radius', protect, restrictTo('shelter'), updateRadiusPreference);

module.exports = router;
