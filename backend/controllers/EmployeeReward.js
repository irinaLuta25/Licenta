const EmployeeRewardDb = require("../models").EmployeeReward;
const RewardDb = require("../models").Reward;

const controller = {
    createEmployeeReward: async (req, res) => {
        try {
            const reward = await EmployeeRewardDb.create({
                receivedAt: req.body.receivedAt,
                employeeId: req.body.employeeId,
                rewardId:req.body.rewardId
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
                receivedAt: req.body.receivedAt,
                employeeId: req.body.employeeId,
                rewardId:req.body.rewardId
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
    },

    getAllRewardsByEmployeeId: async (req, res) => {
        const {employeeId}=req.params;
        if(!employeeId) {
            throw new Error("No ID provided");
        }
        try {
            const rewards = await EmployeeRewardDb.findAll({
                where: {employeeId},
                include: [{ model: RewardDb, as: "reward" }],
                order: [["receivedAt", "ASC"]],
            });
            res.status(200).send(rewards);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },
    
    getAllRewardsByRewardId: async (req, res) => {
        const {rewardId}=req.params;
        if(!rewardId) {
            throw new Error("No ID provided");
        }
        try {
            const rewards = await EmployeeRewardDb.findAll({
                where: {rewardId}
            });
            res.status(200).send(rewards);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },
};

module.exports = controller;
