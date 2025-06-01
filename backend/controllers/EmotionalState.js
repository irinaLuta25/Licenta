const EmotionalStateDb = require("../models").EmotionalState;

const controller = {
    createEmotionalState: async (req, res) => {
        try {
            const emotionalState = await EmotionalStateDb.create({
                mood: req.body.mood,
                intensity: req.body.intensity,
                details: req.body.details,
                employeeId:req.body.employeeId
            });
            res.status(200).send(emotionalState);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    updateEmotionalState: async (req, res) => {
        const id = req.params.id;
        try {
            const emotionalState = await EmotionalStateDb.findByPk(id);
            if (!emotionalState) return res.status(400).send("Emotional state not found");

            const updated = await emotionalState.update({
                mood: req.body.mood,
                intensity: req.body.intensity,
                details: req.body.details,
                employeeId:req.body.employeeId
            });
            res.status(200).send(updated);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    deleteEmotionalState: async (req, res) => {
        try {
            const emotionalState = await EmotionalStateDb.findByPk(req.params.id);
            if (emotionalState) {
                await emotionalState.destroy();
                res.status(200).send("Deleted");
            } else {
                res.status(400).send("Emotional state not found");
            }
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    getAllEmotionalStates: async (req, res) => {
        try {
            const emotionalStates = await EmotionalStateDb.findAll();
            res.status(200).send(emotionalStates);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    getEmotionalStateById: async (req, res) => {
        try {
            const emotionalState = await EmotionalStateDb.findByPk(req.params.id);
            res.status(200).send(emotionalState);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    getAllEmotionalStatesByEmployeeId: async (req, res) => {
        const {employeeId}=req.params;
        if(!employeeId){
            throw new Error("No ID provided");
        }
        try {
            const emotionalStates = await EmotionalStateDb.findAll({
                where: {employeeId},
            });
            res.status(200).send(emotionalStates);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

};

module.exports = controller;