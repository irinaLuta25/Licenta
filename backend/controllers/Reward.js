const RewardDb = require("../models").Reward;

const controller = {
    createReward: async (req, res) => {
        try {
            const reward = await RewardDb.create({
                name: req.body.name,
                category: req.body.category,
                description: req.body.description
            });
            res.status(200).send(reward);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    updateReward: async (req, res) => {
        try {
            const reward = await RewardDb.findByPk(req.params.id);
            if (!reward) return res.status(400).send("Reward not found");

            const updated = await reward.update({
                name: req.body.name,
                category: req.body.category,
                description: req.body.description
            });
            res.status(200).send(updated);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    deleteReward: async (req, res) => {
        try {
            const reward = await RewardDb.findByPk(req.params.id);
            if (reward) {
                await reward.destroy();
                res.status(200).send("Deleted");
            } else {
                res.status(400).send("Reward not found");
            }
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    getAllRewards: async (req, res) => {
        try {
            const rewards = await RewardDb.findAll();
            res.status(200).send(rewards);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    getRewardById: async (req, res) => {
        try {
            const reward = await RewardDb.findByPk(req.params.id);
            res.status(200).send(reward);
        } catch (err) {
            res.status(500).send(err.message);
        }
    }
};

module.exports = controller;
