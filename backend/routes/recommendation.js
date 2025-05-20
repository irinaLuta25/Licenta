const express = require('express');
const router = express.Router();
const recommendationController  = require('../controllers').recommendationController;

router.get('/:employeeId', recommendationController.getRecommendations);

module.exports = router;