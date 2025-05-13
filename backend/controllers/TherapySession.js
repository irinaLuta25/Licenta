const TherapySessionDb = require("../models").TherapySession;
const IntervalDb = require("../models").Interval;
const EmployeeDb = require('../models').Employee;
const UserDb = require('../models').User;

const controller = {
    createTherapySession: async (req, res) => {
        try {
            console.log("BODY PRIMIT LA BACKEND:", req.body);
            const session = await TherapySessionDb.create({
                locationType: req.body.locationType,
                location: req.body.location || null,
                notes: req.body.notes,
                intervalId:req.body.intervalId,
                employeeId:req.body.employeeId
            });
            console.log(session)
            res.status(200).send(session);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    updateTherapySession: async (req, res) => {
        try {
            const session = await TherapySessionDb.findByPk(req.params.id);
            if (!session) return res.status(400).send("Therapy session not found");

            const updated = await session.update({
                locationType: req.body.locationType,
                location: req.body.location,
                notes: req.body.notes
            });
            res.status(200).send(updated);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    deleteTherapySession: async (req, res) => {
        try {
            const session = await TherapySessionDb.findByPk(req.params.id);
            if (session) {
                await session.destroy();
                res.status(200).send("Deleted");
            } else {
                res.status(400).send("Therapy session not found");
            }
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    getAllTherapySessions: async (req, res) => {
        try {
            const sessions = await TherapySessionDb.findAll();
            res.status(200).send(sessions);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    getTherapySessionById: async (req, res) => {
        try {
            const session = await TherapySessionDb.findByPk(req.params.id);
            res.status(200).send(session);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    getAllTherapySessionsByEmployeeId: async (req, res) => {
        const {employeeId}=req.params;
        console.log("employeeId",employeeId)
        if(!employeeId) {
            throw new Error("No ID provided");
        }
        try {
            const sessions = await TherapySessionDb.findAll({
                where: { employeeId },
                include: [IntervalDb]
            });
            console.log(sessions)
            res.status(200).send(sessions);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },
    
    getAllTherapySessionsBySpecialistId: async (req, res) => {
        const { specialistId } = req.params;
        if (!specialistId) {
            return res.status(400).send("No ID provided");
        }
    
        try {
            const sessions = await TherapySessionDb.findAll({
                include: [{
                    model: IntervalDb,
                    where: { specialistId }
                },
                {
                    model: EmployeeDb,
                    include: [{ model: UserDb}]
                }
            ]
            });
    
            res.status(200).send(sessions);
        } catch (err) {
            res.status(500).send(err.message);
        }
    }


};

module.exports = controller;
