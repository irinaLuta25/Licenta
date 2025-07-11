const express = require('express');
const router = express.Router();
const recommendationController  = require('../controllers').recommendationController;
const authMiddleware = require("../middlewares/authMiddleware");
const requireRole = require("../middlewares/requireRole");

router.use(authMiddleware);

router.get('/:employeeId',requireRole("angajat"), recommendationController.getRecommendations);

module.exports = router;