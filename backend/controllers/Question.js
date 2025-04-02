const QuestionDb = require("../models").Question;

const controller = {
    createQuestion: async (req, res) => {
        try {
            const question = await QuestionDb.create({
                text: req.body.text
            });
            res.status(200).send(question);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    updateQuestion: async (req, res) => {
        try {
            const question = await QuestionDb.findByPk(req.params.id);
            if (!question) return res.status(400).send("Question not found");

            const updated = await question.update({
                text: req.body.text
            });
            res.status(200).send(updated);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    deleteQuestion: async (req, res) => {
        try {
            const question = await QuestionDb.findByPk(req.params.id);
            if (question) {
                await question.destroy();
                res.status(200).send("Deleted");
            } else {
                res.status(400).send("Question not found");
            }
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    getAllQuestions: async (req, res) => {
        try {
            const questions = await QuestionDb.findAll();
            res.status(200).send(questions);
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    getQuestionById: async (req, res) => {
        try {
            const question = await QuestionDb.findByPk(req.params.id);
            res.status(200).send(question);
        } catch (err) {
            res.status(500).send(err.message);
        }
    }
};

module.exports = controller;
