const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getApplications,
  getApplicationById,
  createApplication,
  updateApplication,
  deleteApplication,
} = require('../Controllers/applicationController');

// Protect all routes under this router
router.use(protect);

router.route('/')
  .get(getApplications)
  .post(createApplication);

router.route('/:id')
  .get(getApplicationById)
  .patch(updateApplication)
  .delete(deleteApplication);

module.exports = router;
