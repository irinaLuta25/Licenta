const express = require("express");
const router = express.Router();

const { EmployeeGoal, Habit, HabitTracking } = require("../models");
const { checkAndUpdateAllRewards } = require("../utils/awardBadgesOnce");

router.post("/recheck/:employeeId", async (req, res) => {
  const { employeeId } = req.params;

  try {
    await checkAndUpdateAllRewards();
    res.status(200).send(`Verificare și acordare badge-uri efectuată pentru angajatul ${employeeId}`);
  } catch (err) {
    res.status(500).send(err.message);
  }
});


module.exports = router;
