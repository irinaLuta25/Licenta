const EventDb = require("../models").Event;

const controller = {
    createEvent: async (req, res) => {
        try {
            const event = await EventDb.create({
                appointmentType: req.body.appointmentType,
                name: req.body.name,
                description: req.body.description,
                dateTime: req.body.dateTime,
                enrollmentDeadline: req.body.enrollmentDeadline,
                targetDepartment: req.body.targetDepartment
            });
            res.status(200).send(event);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    updateEvent: async (req, res) => {
        try {
            const event = await EventDb.findByPk(req.params.id);
            if (!event) return res.status(400).send("Event not found");

            const updated = await event.update({
                appointmentType: req.body.appointmentType,
                name: req.body.name,
                description: req.body.description,
                dateTime: req.body.dateTime,
                enrollmentDeadline: req.body.enrollmentDeadline,
                targetDepartment: req.body.targetDepartment
            });
            res.status(200).send(updated);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    deleteEvent: async (req, res) => {
        try {
            const event = await EventDb.findByPk(req.params.id);
            if (event) {
                await event.destroy();
                res.status(200).send("Deleted");
            } else {
                res.status(400).send("Event not found");
            }
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    getAllEvents: async (req, res) => {
        try {
            const events = await EventDb.findAll();
            res.status(200).send(events);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    getEventById: async (req, res) => {
        try {
            const event = await EventDb.findByPk(req.params.id);
            res.status(200).send(event);
        } catch (err) {
            res.status(500).send(err.message);
        }
    }
};

module.exports = controller;