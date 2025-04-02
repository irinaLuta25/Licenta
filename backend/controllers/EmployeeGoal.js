const EmployeeGoalDb = require("../models").EmployeeGoal;

const controller = {
    createEmployeeGoal: async (req, res) => {
        try {
            const goal = await EmployeeGoalDb.create({
                targetValue: req.body.targetValue,
                period: req.body.period
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
                targetValue: req.body.targetValue,
                period: req.body.period
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
            const goals = await EmployeeGoalDb.findAll();
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
    }
};

module.exports = controller;