const express = require('express');
const router = express.Router();
const { logSession, getAnalytics } = require('../controllers/sessionController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected by JWT
router.use(protect);

router.post('/', logSession);
router.get('/analytics', getAnalytics);

module.exports = router;
