const SpecialistDb = require("../models").Specialist;
const UserDb = require("../models").User;

const controller = {
  createSpecialist: async (req, res) => {
    const specialist = {
      userId: req.body.userId,
      description: req.body.description,
      linkedin: req.body.linkedin,
      facebook: req.body.facebook,
      website: req.body.website,
      isTherapist: req.body.isTherapist,
      formationName: req.body.formationName,
      specialization: req.body.specialization,
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
      userId: req.body.userId,
      description: req.body.description,
      linkedin: req.body.linkedin,
      facebook: req.body.facebook,
      website: req.body.website,
      specialization: req.body.specialization,
      isTherapist: req.body.isTherapist,
      formation: req.body.formation,
      therapyStyle: req.body.therapyStyle,
    };

    try {
      const specialist = await SpecialistDb.findByPk(specialistId);
      if (!specialist) {
        return res.status(400).send("Specialist not found");
      }

      const newSpecialist = await specialist.update(payload);
      res.status(200).send(newSpecialist);
    } catch (err) {
      console.error("Update Specialist Error:", err);
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
      const specialists = await SpecialistDb.findAll({
        include: [
          {
            model: UserDb,
            as: "user",
          },
        ],
      });
      res.status(200).send(specialists);
    } catch (err) {
      res.status(500).send(err.message);
    }
  },

  getSpecialistById: async (req, res) => {
    const id = req.params.id;
    console.log("ID primit:", id);
    try {
      const specialist = await SpecialistDb.findByPk(id, {
        include: [
          {
            model: UserDb,
            as: "user",
          },
        ],
      });
      res.status(200).send(specialist);
    } catch (err) {
      res.status(500).send(err.message);
    }
  },

  getAllTherapists: async (req, res) => {
    try {
      const therapists = await SpecialistDb.findAll({
        where: {
          isTherapist: true,
        },
        include: [
          {
            model: UserDb,
            as: "user",
          },
        ],
      });
      res.status(200).json(therapists);
    } catch (err) {
      console.error("Eroare in getAllTherapists:", err);
      res.status(500).send(err.message);
    }
  },

  getSpecialistByUserId: async (req, res) => {
    const { userId } = req.params;
    console.log("userId: ", userId);
    try {
      const specialist = await SpecialistDb.findOne({
        where: { userId },
      });
      console.log("SPECIALIST FOUND:", specialist);
      if (!specialist) {
        return res.status(404).send("Specialist not found");
      }
      console.log(specialist);
      res.status(200).json(specialist);
    } catch (err) {
      res.status(500).send(err.message);
    }
  },
};

module.exports = controller;
