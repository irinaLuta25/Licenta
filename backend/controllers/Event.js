const EventDb = require("../models").Event;

const controller = {
    createEvent: async (req, res) => {
        try {
            const event = await EventDb.create({
                name: req.body.name,
                description: req.body.description,
                specialistId:req.body.specialistId,
                dateTime: req.body.dateTime,
                enrollmentDeadline: req.body.enrollmentDeadline,
                targetDepartment: req.body.targetDepartment,
                intervalId:req.body.intervalId,
                type:req.body.type,
                managerIsParticipant:req.body.managerIsParticipant
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
                name: req.body.name,
                description: req.body.description,
                specialistId:req.body.specialistId,
                dateTime: req.body.dateTime,
                enrollmentDeadline: req.body.enrollmentDeadline,
                targetDepartment: req.body.targetDepartment,
                intervalId:req.body.intervalId,
                type:req.body.type,
                managerIsParticipant:req.body.managerIsParticipant
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
    },

    getAllEventsBySpecialistId: async (req, res) => {
        const {specialistId}=req.params;
        if(!specialistId) {
            throw new Error("No ID provided");
        }
        try {
            const events = await EventDb.findAll({
                where: {specialistId}
            });
            res.status(200).send(events);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    getAllEventsByTargetDepartment: async (req, res) => {
        const {targetDepartment}=req.params;
        if(!targetDepartment) {
            throw new Error("No target department provided");
        }
        try {
            const events = await EventDb.findAll({
                where: {targetDepartment}
            });
            res.status(200).send(events);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    getAllTrainings: async (req, res) => {
        try {
            const events = await EventDb.findAll({
                where: {
                    type:"training"
                }
            });
            res.status(200).send(events);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },
    
    getAllWorkshops: async (req, res) => {
        try {
            const events = await EventDb.findAll({
                where: {
                    type:"workshop"
                }
            });
            res.status(200).send(events);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    getAllEventsForManagers: async (req, res) => {
        try {
            const events = await EventDb.findAll({
                where: {
                    managerIsParticipant:true
                }
            });
            res.status(200).send(events);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },
};

module.exports = controller;