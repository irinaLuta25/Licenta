const EmployeeGoalDb = require("../models").EmployeeGoal;
const HabitDb = require("../models").Habit;

const controller = {
  createEmployeeGoal: async (req, res) => {
    try {
      const goal = await EmployeeGoalDb.create({
        employeeId: req.body.employeeId,
        habitId: req.body.habitId,
        targetValue: req.body.targetValue,
        period: req.body.period,
      });
      res.status(200).send(goal);
    } catch (err) {
      res.status(500).send(err.message);
    }
  },

  updateEmployeeGoal: async (req, res) => {
    try {
      const goal = await EmployeeGoalDb.findByPk(req.params.id);
      if (!goal) return res.status(400).send("Goal not found");

      const updated = await goal.update({
        employeeId: req.body.employeeId,
        habitId: req.body.habitId,
        targetValue: req.body.targetValue,
        period: req.body.period,
      });
      res.status(200).send(updated);
    } catch (err) {
      res.status(500).send(err.message);
    }
  },

  deleteEmployeeGoal: async (req, res) => {
    try {
      const goal = await EmployeeGoalDb.findByPk(req.params.id);
      if (goal) {
        await goal.destroy();
        res.status(200).send("Deleted");
      } else {
        res.status(400).send("Goal not found");
      }
    } catch (err) {
      res.status(500).send(err.message);
    }
  },

  getAllEmployeeGoals: async (req, res) => {
    try {
      const goals = await EmployeeGoalDb.findAll({
        where: {
          include: [{ model: HabitDb }],
        },
      });
      res.status(200).send(goals);
    } catch (err) {
      res.status(500).send(err.message);
    }
  },

  getEmployeeGoalById: async (req, res) => {
    try {
      const goal = await EmployeeGoalDb.findByPk(req.params.id);
      res.status(200).send(goal);
    } catch (err) {
      res.status(500).send(err.message);
    }
  },

  getAllEmployeeGoalsByEmployeeId: async (req, res) => {
    const { employeeId } = req.params;
    if (!employeeId) {
      throw new Error("No ID provided");
    }
    try {
      const goals = await EmployeeGoalDb.findAll({
        where: { employeeId },
        include: [
          {
            model: HabitDb,
          },
        ],
      });
      res.status(200).send(goals);
    } catch (err) {
      res.status(500).send(err.message);
    }
  },
};

module.exports = controller;
