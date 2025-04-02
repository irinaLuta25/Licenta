const SpecializationDb = require("../models").Specialization;

const controller = {
    createSpecialization: async (req, res) => {
        try {
            const specialization = await SpecializationDb.create({
                name: req.body.name,
                description: req.body.description
            });
            res.status(200).send(specialization);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    updateSpecialization: async (req, res) => {
        try {
            const specialization = await SpecializationDb.findByPk(req.params.id);
            if (!specialization) return res.status(400).send("Specialization not found");

            const updated = await specialization.update({
                name: req.body.name,
                description: req.body.description
            });
            res.status(200).send(updated);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    deleteSpecialization: async (req, res) => {
        try {
            const specialization = await SpecializationDb.findByPk(req.params.id);
            if (specialization) {
                await specialization.destroy();
                res.status(200).send("Deleted");
            } else {
                res.status(400).send("Specialization not found");
            }
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    getAllSpecializations: async (req, res) => {
        try {
            const list = await SpecializationDb.findAll();
            res.status(200).send(list);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    getSpecializationById: async (req, res) => {
        try {
            const specialization = await SpecializationDb.findByPk(req.params.id);
            res.status(200).send(specialization);
        } catch (err) {
            res.status(500).send(err.message);
        }
    }
};

module.exports = controller;
