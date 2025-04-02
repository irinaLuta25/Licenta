const AnswerDb = require("../models").Answer;

const controller = {
    createAnswer: async (req, res) => {
        try {
            const answer = await AnswerDb.create({
                answer: req.body.answer
            });
            res.status(200).send(answer);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    updateAnswer: async (req, res) => {
        const id = req.params.id;
        try {
            const answer = await AnswerDb.findByPk(id);
            if (!answer) return res.status(400).send("Answer not found");

            const updated = await answer.update({ answer: req.body.answer });
            res.status(200).send(updated);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    deleteAnswer: async (req, res) => {
        try {
            const answer = await AnswerDb.findByPk(req.params.id);
            if (answer) {
                await answer.destroy();
                res.status(200).send("Deleted");
            } else {
                res.status(400).send("Answer not found");
            }
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    getAllAnswers: async (req, res) => {
        try {
            const answers = await AnswerDb.findAll();
            res.status(200).send(answers);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    getAnswerById: async (req, res) => {
        try {
            const answer = await AnswerDb.findByPk(req.params.id);
            res.status(200).send(answer);
        } catch (err) {
            res.status(500).send(err.message);
        }
    }
};

module.exports = controller;