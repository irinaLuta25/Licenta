const EmployeeRewardDb = require("../models").EmployeeReward;

const controller = {
    createEmployeeReward: async (req, res) => {
        try {
            const reward = await EmployeeRewardDb.create({
                receivedAt: req.body.receivedAt
            });
            res.status(200).send(reward);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    updateEmployeeReward: async (req, res) => {
        try {
            const reward = await EmployeeRewardDb.findByPk(req.params.id);
            if (!reward) return res.status(400).send("Employee reward not found");

            const updated = await reward.update({
                receivedAt: req.body.receivedAt
            });
            res.status(200).send(updated);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    deleteEmployeeReward: async (req, res) => {
        try {
            const reward = await EmployeeRewardDb.findByPk(req.params.id);
            if (reward) {
                await reward.destroy();
                res.status(200).send("Deleted");
            } else {
                res.status(400).send("Employee reward not found");
            }
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    getAllEmployeeRewards: async (req, res) => {
        try {
            const rewards = await EmployeeRewardDb.findAll();
            res.status(200).send(rewards);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    getEmployeeRewardById: async (req, res) => {
        try {
            const reward = await EmployeeRewardDb.findByPk(req.params.id);
            res.status(200).send(reward);
        } catch (err) {
            res.status(500).send(err.message);
        }
    }
};

module.exports = controller;
