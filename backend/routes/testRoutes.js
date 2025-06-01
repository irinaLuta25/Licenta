const express = require("express");
const router = express.Router();

const { EmployeeGoal, Habit, HabitTracking } = require("../models");
const { checkAndUpdateReward } = require("../utils/rewardLogic");

router.post("/simulate-reward/:employeeId", async (req, res) => {
  const { employeeId } = req.params;
  const { category = "productivitate", count = 4 } = req.body; // <= doar 4 pt test

  try {
    const habit = await Habit.findOne({ where: { category } });
    if (!habit) return res.status(404).send("Habit not found");

    for (let i = 0; i < count; i++) {
      const goal = await EmployeeGoal.create({
        employeeId,
        habitId: habit.id,
        targetValue: 1,
        period: "zilnic",
      });

      const fakeDate = new Date();
      fakeDate.setDate(fakeDate.getDate() - i); // fiecare completare în altă zi

      await HabitTracking.create({
        employeeGoalId: goal.id,
        value: 1,
        createdAt: fakeDate,
      });
    }

    await checkAndUpdateReward(employeeId, require("../models"));
    res.status(200).send(`Simulated ${count} completions in different days for ${category}`);
  } catch (err) {
    res.status(500).send(err.message);
  }
});


module.exports = router;
