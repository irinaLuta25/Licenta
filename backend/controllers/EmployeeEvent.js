const EmployeeEventDb = require("../models").EmployeeEvent;

const controller = {
    createEmployeeEvent: async (req, res) => {
        try {
            const event = await EmployeeEventDb.create({});
            res.status(200).send(event);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    updateEmployeeEvent: async (req, res) => {
        try {
            const event = await EmployeeEventDb.findByPk(req.params.id);
            if (!event) return res.status(400).send("Employee event not found");

            const updated = await event.update({});
            res.status(200).send(updated);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    deleteEmployeeEvent: async (req, res) => {
        try {
            const event = await EmployeeEventDb.findByPk(req.params.id);
            if (event) {
                await event.destroy();
                res.status(200).send("Deleted");
            } else {
                res.status(400).send("Employee event not found");
            }
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    getAllEmployeeEvents: async (req, res) => {
        try {
            const events = await EmployeeEventDb.findAll();
            res.status(200).send(events);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    getEmployeeEventById: async (req, res) => {
        try {
            const event = await EmployeeEventDb.findByPk(req.params.id);
            res.status(200).send(event);
        } catch (err) {
            res.status(500).send(err.message);
        }
    }
};

module.exports = controller;