const { User } = require("../models");

const SpecialistDb = require("../models").Specialist;

const controller = {
    createSpecialist: async (req, res) => {
        const specialist = {
            userId:req.body.userId,
            description: req.body.description,
            linkedin: req.body.linkedin,
            facebook: req.body.facebook,
            website: req.body.website,
            specialization: req.body.specialization,
            isTherapist: req.body.isTherapist,
            formationName: req.body.formationName,
            therapyStyle: req.body.therapyStyle,
        };

        try {
            const newSpecialist = await SpecialistDb.create(specialist);
            res.status(200).send(newSpecialist);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    updateSpecialist: async (req, res) => {
        const specialistId = req.params.id;
        const payload = {
            userId:req.body.userId,
            description: req.body.description,
            linkedin: req.body.linkedin,
            facebook: req.body.facebook,
            website: req.body.website,
            specialization: req.body.specialization,
            isTherapist: req.body.isTherapist,
            formationName: req.body.formationName,
            therapyStyle: req.body.therapyStyle,
        };

        try {
            const specialist = SpecialistDb.findByPk(specialistId);
            if (!specialist) {
                return res.status(400).send("Specialist not found");
            }

            const newSpecialist = await specialist.update(payload);
            res.status(200).send(newSpecialist);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    deleteSpecialist: async (req, res) => {
        const id = req.params.id;
        try {
            const specialist = await SpecialistDb.findByPk(id);
            if (specialist) {
                await specialist.destroy();
                res.status(200).send("S-a sters");
            }
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    getAllSpecialists: async (req, res) => {
        try {
            const specialists = await specialists.findAll();
            res.status(200).send(specialists);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    getSpecialistById: async (req, res) => {
        const id = req.params.id;
        try {
            const specialist = await SpecialistDb.findByPk(id);
            res.status(200).send(specialist);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    getAllTherapists: async (req, res) => {
        try {
            const therapists = await therapists.findAll({
                where: {
                    isTherapist: true
                }
            });
            res.status(200).send(therapists);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

}

module.exports=controller;