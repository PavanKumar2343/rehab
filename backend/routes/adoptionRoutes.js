const express = require('express');
const router = express.Router();
const {
  submitAdoptionRequest,
  getMyAdoptionRequests,
  getShelterAdoptionRequests,
  updateAdoptionStatus
} = require('../controllers/adoptionController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

router.post('/', protect, submitAdoptionRequest);
router.get('/my-requests', protect, getMyAdoptionRequests);
router.get('/shelter', protect, restrictTo('shelter'), getShelterAdoptionRequests);
router.put('/:id', protect, restrictTo('shelter'), updateAdoptionStatus);

module.exports = router;
