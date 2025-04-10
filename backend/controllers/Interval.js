const { where } = require("sequelize");

const IntervalDb = require("../models").Interval;

const controller = {
    createInterval: async (req, res) => {
        try {
            const interval = await IntervalDb.create({
                date: req.body.date,
                beginTime: req.body.beginTime,
                endTime: req.body.endTime,
                status: req.body.status,
                specialistId:req.body.specialistId
            });
            res.status(200).send(interval);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    updateInterval: async (req, res) => {
        try {
            const interval = await IntervalDb.findByPk(req.params.id);
            if (!interval) return res.status(400).send("Interval not found");

            const updated = await interval.update({
                date: req.body.date,
                beginTime: req.body.beginTime,
                endTime: req.body.endTime,
                status: req.body.status,
                specialistId:req.body.specialistId
            });
            res.status(200).send(updated);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    deleteInterval: async (req, res) => {
        try {
            const interval = await IntervalDb.findByPk(req.params.id);
            if (interval) {
                await interval.destroy();
                res.status(200).send("Deleted");
            } else {
                res.status(400).send("Interval not found");
            }
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    getAllIntervals: async (req, res) => {
        try {
            const intervals = await IntervalDb.findAll();
            res.status(200).send(intervals);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    getIntervalById: async (req, res) => {
        try {
            const interval = await IntervalDb.findByPk(req.params.id);
            res.status(200).send(interval);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    getAllAvailableIntervalsBySpecialistId: async(req,res) => {
        const {specialistId}=req.params;
        if(!specialistId) {
            throw new Error("No ID provided");
        }
        try {
            const availableIntervalsForSpecialist= await IntervalDb.findAll({
                where: {
                    specialistId,
                    status: false
                }
            }
            )
            res.status(200).send(availableIntervalsForSpecialist);
        } catch(err) {
            res.status(500).send(err.message);
        }
    },


};

module.exports = controller;