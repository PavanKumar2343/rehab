const express = require('express');
const router = express.Router();
const {
  reportAnimal,
  getAnimals,
  getAdoptableAnimals,
  getAnimalById,
  getMyReports
} = require('../controllers/animalController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/report', protect, upload.array('photos', 5), reportAnimal);
router.get('/', getAnimals);
router.get('/adoptable', getAdoptableAnimals);
router.get('/my-reports', protect, getMyReports);
router.get('/:id', getAnimalById);

module.exports = router;
