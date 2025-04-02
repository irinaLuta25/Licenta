const HabitDb = require("../models").Habit;

const controller = {
    createHabit: async (req, res) => {
        try {
            const habit = await HabitDb.create({
                name: req.body.name,
                unit: req.body.unit,
                description: req.body.description
            });
            res.status(200).send(habit);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    updateHabit: async (req, res) => {
        try {
            const habit = await HabitDb.findByPk(req.params.id);
            if (!habit) return res.status(400).send("Habit not found");

            const updated = await habit.update({
                name: req.body.name,
                unit: req.body.unit,
                description: req.body.description
            });
            res.status(200).send(updated);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    deleteHabit: async (req, res) => {
        try {
            const habit = await HabitDb.findByPk(req.params.id);
            if (habit) {
                await habit.destroy();
                res.status(200).send("Deleted");
            } else {
                res.status(400).send("Habit not found");
            }
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    getAllHabits: async (req, res) => {
        try {
            const habits = await HabitDb.findAll();
            res.status(200).send(habits);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    getHabitById: async (req, res) => {
        try {
            const habit = await HabitDb.findByPk(req.params.id);
            res.status(200).send(habit);
        } catch (err) {
            res.status(500).send(err.message);
        }
    }
};

module.exports = controller;