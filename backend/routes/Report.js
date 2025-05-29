const express = require("express");
const router = express.Router();

const reportsController = require("../controllers").reportsController;

router.get("/getMoodEvolution/:managerId", reportsController.getMoodEvolution);
router.get("/getMoodFrequency/:managerId", reportsController.getMoodFrequency);
router.get("/getProblemsPerMonth/:managerId", reportsController.getProblemsPerMonth);
router.get("/getEventTypeDistribution/:managerId",reportsController.getEventTypeDistribution)
router.get('/getTherapySatisfactionDistribution/:managerId', reportsController.getTherapySatisfactionDistribution);




module.exports = router;
