const express = require("express");
const router = express.Router();

const reportsController = require("../controllers").reportsController;

router.get("/getMoodEvolution/:managerId", reportsController.getMoodEvolution);

module.exports = router;
