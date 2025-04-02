const SpecialistSpecializationDb = require("../models").SpecialistSpecialization;

const controller = {
    createSpecialistSpecialization: async (req, res) => {
        try {
            const ss = await SpecialistSpecializationDb.create({
                dateAcquired: req.body.dateAcquired
            });
            res.status(200).send(ss);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    updateSpecialistSpecialization: async (req, res) => {
        try {
            const ss = await SpecialistSpecializationDb.findByPk(req.params.id);
            if (!ss) return res.status(400).send("SpecialistSpecialization not found");

            const updated = await ss.update({
                dateAcquired: req.body.dateAcquired
            });
            res.status(200).send(updated);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    deleteSpecialistSpecialization: async (req, res) => {
        try {
            const ss = await SpecialistSpecializationDb.findByPk(req.params.id);
            if (ss) {
                await ss.destroy();
                res.status(200).send("Deleted");
            } else {
                res.status(400).send("SpecialistSpecialization not found");
            }
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    getAllSpecialistSpecializations: async (req, res) => {
        try {
            const list = await SpecialistSpecializationDb.findAll();
            res.status(200).send(list);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    getSpecialistSpecializationById: async (req, res) => {
        try {
            const ss = await SpecialistSpecializationDb.findByPk(req.params.id);
            res.status(200).send(ss);
        } catch (err) {
            res.status(500).send(err.message);
        }
    }
};

module.exports = controller;
