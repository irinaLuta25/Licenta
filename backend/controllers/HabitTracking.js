const HabitTrackingDb = require("../models").HabitTracking;
const EmployeeGoalDb = require("../models").EmployeeGoal;
const { checkAndUpdateReward } = require("../utils/rewardLogic");

const controller = {
  createHabitTracking: async (req, res) => {
    try {
      const record = await HabitTrackingDb.create({
        employeeGoalId: req.body.employeeGoalId,
        value: req.body.value,
      });

      const goal = await EmployeeGoalDb.findByPk(req.body.employeeGoalId);
      let rewardGranted = false;

      if (goal) {
        rewardGranted = await checkAndUpdateReward(goal.employeeId);
      }

      res.status(200).json({ record, rewardGranted });
    } catch (err) {
      res.status(500).send(err.message);
    }
  },

  updateHabitTracking: async (req, res) => {
    try {
      const record = await HabitTrackingDb.findByPk(req.params.id);
      if (!record) return res.status(400).send("Habit tracking not found");

      const updated = await record.update({
        employeeGoalId: req.body.employeeGoalId,
        value: req.body.value,
      });
      res.status(200).send(updated);
    } catch (err) {
      res.status(500).send(err.message);
    }
  },

  deleteHabitTracking: async (req, res) => {
    try {
      const record = await HabitTrackingDb.findByPk(req.params.id);
      if (record) {
        await record.destroy();
        res.status(200).send("Deleted");
      } else {
        res.status(400).send("Habit tracking not found");
      }
    } catch (err) {
      res.status(500).send(err.message);
    }
  },

  getAllHabitTrackings: async (req, res) => {
    try {
      const records = await HabitTrackingDb.findAll();
      res.status(200).send(records);
    } catch (err) {
      res.status(500).send(err.message);
    }
  },

  getHabitTrackingById: async (req, res) => {
    try {
      const record = await HabitTrackingDb.findByPk(req.params.id);
      res.status(200).send(record);
    } catch (err) {
      res.status(500).send(err.message);
    }
  },

  getAllHabitTrackingByEmployeeGoalId: async (req, res) => {
    const { employeeGoalId } = req.params;

    if (!employeeGoalId) {
      throw new Error("No ID provided");
    }
    try {
      const records = await HabitTrackingDb.findAll({
        where: {
          employeeGoalId,
        },
      });
      res.status(200).send(records);
    } catch (err) {
      res.status(500).send(err.message);
    }
  },
};

module.exports = controller;
