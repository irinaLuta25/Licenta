const EmployeeEventDb = require("../models").EmployeeEvent;

const controller = {
    createEmployeeEvent: async (req, res) => {
        try {
            const event = await EmployeeEventDb.create({
                employeeId:req.body.employeeId,
                eventId:req.body.eventId
            });
            res.status(200).send(event);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    updateEmployeeEvent: async (req, res) => {
        try {
            const event = await EmployeeEventDb.findByPk(req.params.id);
            if (!event) return res.status(400).send("Employee event not found");

            const updated = await event.update({
                employeeId:req.body.employeeId,
                eventId:req.body.eventId
            });
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
    },

    getAllEmployeeEventsByEmployeeId: async (req, res) => {
        const {employeeId}=req.params;
        console.log("AAAAAAA employeeId din controller: ", employeeId)
        if(!employeeId){
            throw new Error("No ID provided");
        }
        try {
            const events = await EmployeeEventDb.findAll({
                where: {employeeId}
            });
            console.log("!!!!!!!!!!!!!!!!!events din back: ",events)
            res.status(200).send(events);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },
};

module.exports = controller;